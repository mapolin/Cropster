Cropster.Extend('Image', {
    input: null,
    init: function() {
        this.input = document.querySelector(Cropster.Settings.selectors.input);
        this.bind();
    },
    bind: function() {
        this.input.ondragover = function (e) { e.target.classList.add('hover'); return false; };
        this.input.ondragend = function (e) { e.target.classList.remove('hover'); return false; };

        this.input.ondrop = function (e) {
            e.preventDefault();

            var file = e.dataTransfer.files[0],
                reader = new FileReader(),
                target = e.target;
                input = this;

            reader.onload = function (event) {
                var dataURL = event.target.result;

                if(dataURL.indexOf('data:image/') == 0) {
                    Cropster.Image.onload && Cropster.Image.onload(dataURL);
                }
                else {
                    Cropster.Error.auto(target);
                }
            };

            try {
                if(file.size == 0) {
                    Cropster.Error.auto(target);
                }
                else {
                    reader.readAsDataURL(file);
                }
            }
            catch(ex) {
                Cropster.Error.auto(target);
            }

            return false;
        };
    },
    onload: null
});

Cropster.Extend('ImageObject', function(data, callback) {
    var _image = this;
    var image = new Image();
        image.src = data;

    _image.image = null;

    image.onload = function() {
        _image.image = new Kinetic.Image({
            x: 0,
            y: 0,
            image: this,
            width: this.width,
            height: this.height
        });

        callback && callback(_image);
    }
});

Cropster.DOMReady.enqueue(function() {
    Cropster.Image.init();
});