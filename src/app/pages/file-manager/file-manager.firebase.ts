import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FileManagerFirebase {
  private basePath: string = 'uploads';
  filesRef: AngularFireList<any>;
  file: Observable<any>;

  constructor(private db: AngularFireDatabase) {
    this.filesRef = this.db.list(this.basePath);
  }

  getFilesList() {
    return this.filesRef
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(snap =>
            Object.assign(snap.payload.val(), { $key: snap.key })
          )
        )
      );
  }

  getFile(key) {
    const path = `${this.basePath}/${key}`;
    this.file = this.db.object(path).valueChanges();
    return this.file;
  }

  deleteFileData(key) {
    this.filesRef.remove(key);
  }

  createFile(file) {
    this.filesRef.push(file);
  }
}
