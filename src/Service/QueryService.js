import fs from 'fs';
import path from 'path';
import { each } from 'lodash';

class QueryService {
  constructor() {
    this.whitespace = ' ';
    this.extension = '.sql';
    this.defaultPath = path.join(__dirname, '../Query/');
    this.loadDefaultQueries();
  }

  loadQuery(file) {
    return fs.readFileSync(file).toString().replace(/\s\s+/g, this.whitespace);
  }

  loadQueries(directory) {
    const output = {};
    each(fs.readdirSync(directory), (file) => {
      if (file) {
        output[path.basename(file, this.extension)] = this.loadQuery(`${directory}${file}`);
      }
    });
    return output;
  }

  loadDefaultQueries() {
    this.queries = this.loadQueries(this.defaultPath);
  }
}

export default new QueryService();
