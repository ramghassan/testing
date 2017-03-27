import Hapi from 'hapi';
import MarkDown from '../utils/markdown';

class SwaggerHandler {
  index() {
    return {
      handler: function(request, reply) {
        let markDown = new MarkDown();
	    markDown.getMarkDownHTML(__dirname.replace('/lib/handlers','') + '/README.md', function(err, data){
          reply.view('swagger.html', {
              title: 'Pulse-API',
              markdown: data
          });
	     });
      }
    }
  }
}
export default SwaggerHandler;
