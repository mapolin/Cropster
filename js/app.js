'user strict';

var Cropster = window.Cropster || {};

Cropster.Extend = function(name, object, overwrite, save) {
    if(!name) {
        throw 'No Function name provided.';
    }
    
    if(!object) {
        throw 'No Function body provided for Cropster.Extend[ ' + name + ' ].'; 
    }
    
    if(name.indexOf(':') > -1) {
        var member = name.split(':')[0];
        name = name.split(':')[1];
    }
    
    if( (Cropster[name] && !overwrite) || (Cropster[member] && !overwrite) ) {
        if(member) {
            if(Cropster[member][name]) {
                throw 'Function ' + name + ' already exists as a member of Object ' + member + '. Please change it or specify if you want to overwrite it using Cropster.Extend(name, fn, overwrite).';
            }
            
            if(typeof Cropster[member] == 'function') {
                throw 'Cropster[ ' + member + ' ] is a Function and Methods can not be added to it. If you want to change it use: Cropster.Extend(name, fn, overwrite).';
            }
        }
        else {
            throw 'Function ' + name + ' already exists. Please change it or specify if you want to overwrite it using Cropster.Extend(name, fn, overwrite).';
        }
    }

    if(member && !Cropster[member]) {
        Cropster[member] = {};
    }
    else if(member && Cropster[member] && overwrite) {
        if(save) {
            Cropster['_' + member] = Cropster[member];
        }
        Cropster[member] = {};
    }

    if(typeof object != 'function') {
        if(member) Cropster[member][name] = {};
        else if(object.constructor && object.constructor.name != 'object') {
            Cropster[name] = object;
            return Cropster[name];
        }
        else Cropster[name] = {};

        for(var prop in object) {
            if(member) {
                Cropster[member][name][prop] = object[prop];
            }
            else {
                Cropster[name][prop] = object[prop];
            }
        }
    }
    else {
        if(member) {
            Cropster[member][name] = object;
        }
        else {
            Cropster[name] = object;
        }
    }

    return (member) ? Cropster[member][name] : Cropster[name];
};

Cropster.Extend('Error', {
    add: function(element) {
        element.classList.add('error');
    },
    remove: function(element) {
        element.classList.remove('error');
    },
    auto: function(element) {
        this.add(element);
        setTimeout(function() {
            Cropster.Error.remove(element);
        }, 2000);
    }
});

Cropster.Extend('DOMReady', {
    que: [],
    enqueue: function(callback) {
        this.que.push(callback);

        this.unbind();
        this.bind();
    },
    unbind: function() {
        window.removeEventListener('load', this.execute, false);
    },
    bind: function() {
        window.addEventListener('load', this.execute, false);
    },
    execute: function() {
        var i;
        for(i in Cropster.DOMReady.que) {
            Cropster.DOMReady.que[i]();
        }
    }
});