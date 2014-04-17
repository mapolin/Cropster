Cropster.Extend('Stage', function(element) {
    if(!element) {
        element = Cropster.Settings.selectors.stage;
    }

    var _self = this;

    this.layers = false;
    this.stage = new Kinetic.Stage({
        container: document.querySelector(element)
    });

    this.resize = function() {
        _self.stage.width(0);
        _self.stage.height(0);

        _self.stage.width(_self.stage.container().clientWidth - 20);
        _self.stage.height(window.innerHeight - 20);

        return {
            width: _self.stage.container().parentNode.innerWidth,
            height: window.innerHeight
        };
    };

    this.addLayer = function(name) {
        if(!this.layers) {
            this.layers = {};
        }

        var l = new Kinetic.Layer({
            name: name || ''
        });

        this.layers[name] = l;

        this.stage.add(l);

        return l;
    };

    this.addObject = function(object, layer, draw) {
        if(!this.layers) {
            var l = this.addLayer(layer);
        }

        if(layer && !l) {
            l = this.layers[layer];
        }
        else if(!layer && !l) {
            l = this.layers['default'];
        }
    
        l.add(object);

        if(draw) {
            this.stage.draw();
        }
    };

    this.getWidth = function() {
        return _self.stage.width();
    };
    this.getHeight = function() {
        return _self.stage.height();
    };

    this.addLayer('default');
    this.resize();

    window.addEventListener('resize', this.resize, false);
});

Cropster.Extend('Paint', {
    fit: function(image, resize, maxWidth, maxHeight) {
        var ratio = image.getWidth() / image.getHeight();

        if( maxWidth ) {
            var width = Math.min( maxWidth, image.getWidth() );
            var height = width / ratio;
        }
        else if( this.Stage.getWidth() < image.getWidth() ) {
            var width = Math.min( this.Stage.getWidth(), image.getWidth() );
            var height = width / ratio;
        }

        if( maxHeight ) {
            var height = Math.min( maxHeight, image.getHeight() );
            var width = width / ratio;
        }
        else if( this.Stage.getHeight() < image.getHeight() ) {
            var height = Math.min( this.Stage.getHeight(), image.getHeight() );
            var width = width / ratio;
        }

        if(resize) {
            image.width(width);
            image.height(height);
        }

        return {
            width: width,
            height: height
        }
    },
    init: function() {
        var _this = this;

        this.Stage = new Cropster.Stage();

        Cropster.Image.onload = function(dataURL) {
            var img = new Cropster.ImageObject(dataURL, function(image) {

                _this.fit(image.image);
                _this.Stage.addObject(image.image, 'image', true);
            });
        }
    },
    draw: function() {
        this.Stage.stage.draw();
    }
});

Cropster.DOMReady.enqueue(function() {
    Cropster.Paint.init();
});