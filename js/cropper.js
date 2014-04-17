Cropster.Extend('Cropper', function() {
    var _this = this;

    this.group = new Kinetic.Group({
        draggable: true
    });

    this.controls = [
        {
            name: 'topLeft',
            width: 17,
            height: 17,
            fill: 'rgba(140,140,140,.4)'
        },
        {
            name: 'topRight',
            width: 17,
            height: 17,
            fill: 'rgba(140,140,140,.4)'
        },
        {
            name: 'bottomLeft',
            width: 17,
            height: 17,
            fill: 'rgba(140,140,140,.4)'
        },
        {
            name: 'bottomRight',
            width: 17,
            height: 17,
            fill: 'rgba(140,140,140,.4)'
        }
    ];

    this.object = new Cropster.ImageObject(Cropster.Settings.selectors.cropper, function(image) {
        _this.cropper = image.image;

        var size = Cropster.Paint.fit(_this.cropper, false, 300, 300);

        _this.cropper.width(size.width);
        _this.cropper.height(size.height);

        _this.group.add(_this.cropper);
        _this.initCrop(size);

        Cropster.Paint.draw();
    });

    this.overlay = new Kinetic.Rect({
        width: Cropster.Paint.Stage.getWidth(),
        height: Cropster.Paint.Stage.getHeight(),
        fill: 'rgba(0,0,0,.3)'
    });

    Cropster.Paint.Stage.addLayer('crop');
    Cropster.Paint.Stage.addObject(this.overlay);
    Cropster.Paint.Stage.addObject(this.group);

    this.update = function(control) {
        switch(control.getName()) {
            case 'topLeft': 
                break;
            case 'topRight': 
                break;
            case 'bottomLeft': 
                break;
            case 'bottomRight': 
                break;
            default: return;

            Cropster.Paint.draw();
        }
    };

    this.initCrop = function(size) {
        for(var ctrl in this.controls) {
            var ctrl = new Kinetic.Rect(this.controls[ctrl]);

            var x = (ctrl.name() == 'topLeft' || ctrl.name() == 'bottomLeft') ? 0 : size.width - ctrl.getWidth();
            var y = (ctrl.name() == 'topLeft' || ctrl.name() == 'topRight') ? 0 : size.height - ctrl.getHeight();

            ctrl.position({
                x: x,
                y: y
            });

            ctrl.on('dragmove', function() {
                _this.update(this);
            });
            ctrl.on('mousedown touchstart', function() {
                _this.group.setDraggable(false);
                this.moveToTop();
            });
            ctrl.on('dragend', function() {
                _this.group.setDraggable(true);
                _this.update(this);
            });
            // add hover styling
            ctrl.on('mouseover', function() {
                var layer = this.getLayer();
                this.setFill('rgba(140,140,140,.6)');
                layer.draw();
            });
            ctrl.on('mouseout', function() {
                var layer = this.getLayer();
                this.setFill('rgba(140,140,140,.4)');
                layer.draw();
            });

            this.group.add(ctrl);
        }
    }
});

Cropster.DOMReady.enqueue(function() {
    var Crop = new Cropster.Cropper();
});