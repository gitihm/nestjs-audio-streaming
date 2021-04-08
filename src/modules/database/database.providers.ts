import * as mongoose from 'mongoose'

mongoose.set('debug', true)

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        `mongodb://myuser:secret@localhost:27017/mydatabase`,
        {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useFindAndModify: false,
        },
      ),
  },
]
