import fs from 'fs';
import path from 'path';

class MarkDown {
  getMarkDownHTML( path, callback ) {
    fs.readFile(path, 'utf8', function (err,data) {
      if (!err) {
        marked.setOptions({
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: true,
          smartLists: true,
          smartypants: false,
          langPrefix: 'language-',
          highlight: function(code, lang) {
              return code;
          }
      });
      data = marked(data);
    }
    callback( err, data );
    });
  }
}
export default MarkDown;
