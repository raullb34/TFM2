#!/usr/bin/python3

import pandas as pd
import re
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.models import Model
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Activation, Dense, Dropout, Input, Embedding
from tensorflow.keras.optimizers import RMSprop
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing import sequence
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.preprocessing.sequence import pad_sequences

class PredictModel():
    max_words = 2000
    max_len = 400
    token = Tokenizer(num_words=max_words, lower=True, split=' ')
    model = Sequential()
    # def check_if_tf_version_valid(self):
    #     # Check tensorflow version
    #     if float(tf.__version__[0]) < 2.0:
    #         print('Updating tensorflow')
    #         #!pip install tensorflow==2.0
    #         return False
    #     else:
    #         print('Correct version of Tensorflow installed.')
    #         return True

    def load_data(self):
        df = pd.read_excel('C:/Users\Raul\Documents\TFM\model_AI\\train.xls')
        df = df.drop(df.loc[df.Text == ' '].index)
        df = df.fillna(' ')
        df.loc[df['Category'] == 'True','Category'] = 0
        df.loc[df['Category'] == 'Fake','Category'] = 1

        return df

    def predict(self, text):

        seq = self.token.texts_to_sequences(text)
        padded = pad_sequences(seq, maxlen=self.max_len)
        no_fake_news_pred = self.model.predict(padded)

        return no_fake_news_pred

    def __init__(self):
        # if not self.check_if_tf_version_valid():
        #     print("Please update TF version")
        #     return

        # Retrieve the data
        df = self.load_data()
        print(df.count())

        ## train/test split the text data and labels
        features = df['Text']
        labels = df['Category']
        X_train, X_test, y_train, y_test = train_test_split(features, labels, random_state = 42)



        self.token.fit_on_texts(X_train.values)
        sequences = self.token.texts_to_sequences(X_train.values)
        train_sequences_padded = pad_sequences(sequences, maxlen=self.max_len)

        embed_dim = 50
        lstm_out = 64
        batch_size = 32

        self.model.add(Embedding(self.max_words, embed_dim, input_length = self.max_len))
        self.model.add(LSTM(lstm_out))
        self.model.add(Dense(256))
        self.model.add(Activation('relu'))
        self.model.add(Dropout(0.5))
        self.model.add(Dense(1, name='out_layer'))
        self.model.add(Activation('sigmoid'))
        self.model.compile(loss = 'binary_crossentropy', optimizer='adam',metrics = ['accuracy'])
        print(self.model.summary())

        train_sequences_padded = np.asarray(train_sequences_padded).astype('float32')
        y_train = np.asarray(y_train.tolist()).astype('float32')

        history = self.model.fit(train_sequences_padded, y_train, batch_size=batch_size, epochs=5, validation_split=0.2)

        print("Training Complete")