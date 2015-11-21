; (function (w, d, undefined) {

    var _viewElement = null;

    var star = function () {
        this.route = {}
    }

    star.prototype.addRoute = function (route, templete, controller) {
        this.route[route] = {
            "templete": templete,
            "controller": controller
        }
    }

    star.prototype.init = function (viewElement) {
        _viewElement = viewElement

        var startApp = startAppRaw.bind(this)

        w.onhashchange = startApp

        startApp()
    }

    var startAppRaw = function () {
        var pageHash = window.location.hash.replace(/#\//, '')
        if (this.route[pageHash]) {
            loadTemp(this.route[pageHash])
        } else {
            console.error(pageHash + ' is not in route table.')
        }
    }

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

    var renderTemp = function (rawTemp, controller) {
        var model = {}, temp = rawTemp
        controller(model)
        for (key in model) {
            temp = temp.replace('<% ' + key +' %>', model[key])
        }
        render(temp)
    }

    var render = function (temp) {
        _viewElement.innerHTML = temp;
    }

    w['star'] = new star();

})(window, document)