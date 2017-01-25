import express = require('express');

export interface IDataController<T> {
  getAllById(req: express.Request, res: express.Response) : void;
  getLatestById(req: express.Request, res: express.Response) : void;
  addDataRecord(data: T): void;
  deleteAllById(id: string): void;
}

