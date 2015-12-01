; (function (w, d, undefined) {

    var _viewElement = null;

    /**
     * The constructor of StarMVC.
     * @constructor
     */
    function star () {
        this.route = {}
    }

    /**
     * Add route in the route table.
     * @param {string} route - the name of the route
     * @param {string} templete - the path of the view templete
     * @param {function} controller - the container of the data that will render in the templete.
     */
    star.prototype.addRoute = function (route, templete, controller) {
        this.route[route] = {
            "templete": templete,
            "controller": controller
        }
    }

    /**
     * Initialize the StarMVC application.
     * @param {string} viewElement - the DOM object that you templete will render in
     */
    star.prototype.init = function (viewElement) {
        _viewElement = d.querySelector(viewElement)
        var startAppBind = startApp.bind(this)
        w.onhashchange = startAppBind
        startAppBind()
    }

    /**
     * Start the StarMVC App.
     */
    var startApp = function () {
        var pageHash = window.location.hash.replace(/#\//, '') || 'home';
        if (this.route[pageHash]) {
            loadTemp(this.route[pageHash])
        } else {
            console.error(pageHash + ' is not in route table.')
        }
    }

    /**
     * Load the templete that will be renderd, use ajax.
     * @param {object} route - the route object that contains the required information.
     */
    var loadTemp = function (route) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', route.templete, true)
        xhr.send()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                renderTemp(xhr.responseText, route.controller)
            }
        }
    }

    /**
     * The core of the templete engine.
     * Thanks to Krasimir. (http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line)
     * @param {string} rawTemp - the templete.
     * @param {function} controller - the container of the data that will render in the templete.
     */
    var renderTemp = function (rawTemp, controller) {
        var model = {}, re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0, match;
        controller(model)
        var add = function(line, js) {
            js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        }
        while(match = re.exec(rawTemp)) {
            add(rawTemp.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }
        add(rawTemp.substr(cursor, rawTemp.length - cursor));
        code += 'return r.join("");';
        render(new Function(code.replace(/[\r\t\n]/g, '')).apply(model));
    }

    /**
     * Render the DOM tree in the view.
     * @parma {string} temp - the DOM tree that will render in view.
     */
    var render = function (temp) {
        _viewElement.innerHTML = temp;
    }

    // exports the object instance to the window.
    w['star'] = new star();

})(window, document)