import { ObjectId} from 'mongodb'

export interface Note {
  _id: ObjectId;
  folder: string;
  title: string;
  content: string;
}
