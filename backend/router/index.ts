import express from 'express';
import { loginUser, getUser, postUser, deleteUser } from '../controller/controllerUser';
import { getNews, getNewsInfo, getNewsByUrl, postNews, deleteNews } from '../controller/controllerNews';
import { getReport, getReportByUser, getAllReports, postReport, patchReport, deleteReport } from '../controller/controllerReport';
import jwt from 'jsonwebtoken';
import passportJWT from 'passport-jwt';
import axios from 'axios';
import config from '../config.json';


var router = express.Router();

var jwtOptions = {} as any;

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'e$aYE&WjK.D3>jx';


//User

/**
 * This function check the user passed as body and logs it in
 * @route POST /login
 * @group Login
 * @param {string} user.body.required
 * @param {string} password.body.required
 * @returns {object} 200 - The user token and its identifier
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */
router.post('/login', async function (req, res) {
    const body = req.body;
    if (body) {
        var user = body.user;
        var pass = body.password;
        loginUser(user, pass, (result: any) => {
            if (result !== undefined) {
                var payload = { id: result._id };
                var token = jwt.sign(payload, jwtOptions.secretOrKey);
                res.status(200).json({ token: token, id: result._id });
            }
            else {
                return res.status(404).send();
            }
        });
    }
    else {
        return res.status(400).send();
    }
})

/**
 * This function create a new user
 * @route POST /users
 * @group Users
 * @param {string} user.body.required
 * @param {string} password.body.required
 * @returns {User} 201- The new user
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */

router.post('/users', async (req, res) => {
    if (req.body) {
        postUser(req.body.user, req.body.password).then((user) => {
            return res.status(201).json(user);
        })
            .catch((err) => {
                return res.status(400).json({
                    errorCode: 400,
                    message: err
                })
            })
    }
    else {
        return res.status(404).send();
    }
});

/**
 * This function create a new user
 * @route GET /users/:id
 * @group Users
 * @param {string} id.required - the user id
 * @returns {User} 200 - The user info
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */

router.get('/users/:id', async (req, res) => {
    getUser(req.params.id).then((user) => {
        return res.status(200).json(user);
    }).catch((err) => {
        return res.status(400).json({
            errorCode: 400,
            message: err
        })
    })
});

/**
 * This function create a new user
 * @route DELETE /users/:id
 * @group Users
 * @param {string} id.required - the user id
 * @returns {User} 200 - The user info
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */

router.delete('/users/:id', async (req, res) => {
    deleteUser(req.params.id).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        return res.status(400).json({
            errorCode: 400,
            message: err
        })
    })
});

//News

/**
 * This function create a new news
 * @route POST /news
 * @group News
 * @param {string} author.required - the author name
 * @param {string} url.required - the url of the news
 * @returns {News} 201 - The news info
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */

router.post('/news', async (req, res) => {
    if (req.body) {
        let author = '';
        if (req.body.author === 'learn_system') {
            author = 'learn_system';
        } else {
            author =  req.body.url.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)(:([^\/]*))?((\/[\w\/-]+)*\/)([\w\-\.]+[^#?\s]+)(\?([^#]*))?(#(.*))?$/i)[3];
        }
      
        postNews(author, req.body.url).then((news) => {
            console.log(news);
            return res.status(201).json(news);
        }).catch((err) => {
            getNewsByUrl(req.body.url).then((eq_news) => {
                return res.status(202).json(eq_news[0]);
            }).catch((err) => {
                return res.status(400).json({
                    errorCode: 400,
                    message: err
                })
            })
        })
    }
    else {
        return res.status(404).send();
    }
});

/**
 * This function get a news
 * @route GET /news/:id
 * @group News
 * @param {string} id.required - the user id
 * @returns {User} 200 - The news info
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */
router.get('/news/:id', async (req, res) => {
    getNews(req.params.id).then((news) => {
        return res.status(201).json(news);
    }).catch((err) => {
        return res.status(400).json({
            errorCode: 400,
            message: err
        })
    })
});

/**
 * This function get a news
 * @route GET /news
 * @group News
 * @param {string} id.required - the user id
 * @returns {User} 200 - The news info
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */
router.get('/news/', async (req, res) => {
    getNewsInfo('learn_system').then((news) => {
        return res.status(201).json(news);
    }).catch((err) => {
        return res.status(400).json({
            errorCode: 400,
            message: err
        })
    })
});

/**
 * This function delete a news
 * @route DELETE /news/:id
 * @group News
 * @param {string} id.required - the news id
 * @returns {User} 200 - The news delete
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */
router.delete('/news/:id', async (req, res) => {
    deleteNews(req.params.id).then((result) => {
        return res.status(201).json(result);
    }).catch((err) => {
        return res.status(400).json({
            errorCode: 400,
            message: err
        })
    })
});

//Reports

/**
 * This function create a new news
 * @route POST /reports
 * @group Reports
 * @param {string} authorId.required - the author id
 * @param {string} newsId.required - the news id
 * @param {[string]} tags.required - the tags of the news
 * @param {string} fake.required - the user report
 * @returns {Reports} 201 - The report info
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */
router.post('/reports', async (req, res) => {
    if (req.body) {
        postReport(req.body.authorId, req.body.newsId, req.body.tags, req.body.fake).then((user) => {
            return res.status(201).json(user);
        })
            .catch((err) => {
                return res.status(400).json({
                    errorCode: 400,
                    message: err
                })
            })
    }
    else {
        return res.status(404).send();
    }
});

/**
 * This function create a new news
 * @route PATCH /reports
 * @group Reports
 * @param {string} authorId.required - the author id
 * @param {string} newsId.required - the news id
 * @param {[string]} tags.required - the tags of the news
 * @param {string} shared.required - the news was shared
 * @returns {Reports} 201 - The report info
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */
router.patch('/reports', async (req, res) => {
    if (req.body) {
        patchReport(req.body.authorId, req.body.newsId, req.body.tags, req.body.shared).then((user) => {
            return res.status(201).json(user);
        })
            .catch((err) => {
                return res.status(400).json({
                    errorCode: 400,
                    message: err
                })
            })
    }
    else {
        return res.status(404).send();
    }
});

/**
 * This function gets a report
 * @route GET /reports/:id
 * @group Reports
 * @param {string} id.required - the user id
 * @returns {Report} 200 - The report info
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */
router.get('/reports/:id', async (req, res) => {
    getReport(req.params.id).then((user) => {
        return res.status(200).json(user);
    }).catch((err) => {
        return res.status(400).json({
            errorCode: 400,
            message: err
        })
    })
});

/**
 * This function gets reports
 * @route GET /reports
 * @group Reports
 * @param {string} id.required - the user id
 * @returns {Report} 200 - The report info
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */
router.get('/reports/', async (req, res) => {
    if (req.query.userId) {
        getReportByUser(req.query.userId as string).then((reports) => {
            return res.status(200).json(reports);
        }).catch((err) => {
            return res.status(400).json({
                errorCode: 400,
                message: err
            })
        })
    }
    else {
        getAllReports().then((reports) => {
            return res.status(201).json(reports);
        }).catch((err) => {
            return res.status(400).json({
                errorCode: 400,
                message: err
            })
        })
    }
});


/**
 * This function delete a report
 * @route DELETE /reports/:id
 * @group Reports
 * @param {string} id.required - the news id
 * @returns {User} 200 - The report delete
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */
router.delete('/reports/:id', async (req, res) => {
    deleteReport(req.params.id).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        return res.status(400).json({
            errorCode: 400,
            message: err
        })
    })
});

// predict

/**
 * This function create a new news
 * @route POST /predict
 * @group Predictions
 * @param {string} text.required - the news text
 * @returns {Reports} 201 - The report info
 * @returns {void} 400 - Bad request
 * @returns {void} 404 - Not found
 */
router.post('/predict', async (req, res) => {
    if (req.body) {
        console.log(req.body.text);
        const result = await axios.post(config.api_python, { text: [req.body.text] });
        console.log(result.data)
        return res.status(201).send(result.data);
    }
    else {
        return res.status(404).send();
    }
});



async function checkAuth(token: string): Promise<any> {
    const tk = token.split(' ')[1];
    try {
        let result = await jwt.verify(tk, jwtOptions.secretOrKey);
        return result ? result : null;
    } catch {
        return null;
    }
}


export default router;