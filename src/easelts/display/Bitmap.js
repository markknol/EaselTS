var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './DisplayObject', '../geom/Size'], function (require, exports, DisplayObject, Size) {
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap(imageOrUri, width, height, x, y, regX, regY) {
            var _this = this;
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.type = 7 /* BITMAP */;
            this.bitmapType = 0 /* UNKNOWN */;
            this.loaded = false;
            this.image = null;
            this._imageNaturalWidth = null;
            this._imageNaturalHeight = null;
            this._isTiled = false;
            this.sourceRect = null;
            this.destinationRect = null;
            var image;
            if (typeof imageOrUri == "string") {
                image = document.createElement("img");
                image.src = imageOrUri;
            }
            else {
                image = imageOrUri;
            }
            var tagName = '';
            if (image) {
                tagName = image.tagName.toLowerCase();
            }
            switch (tagName) {
                case 'img':
                    {
                        this.image = image;
                        this.bitmapType = 1 /* IMAGE */;
                        if ((this.image['complete'] || this.image['getContext'] || this.image['readyState'] >= 2)) {
                            this.onLoad();
                        }
                        else {
                            this.image.addEventListener('load', function () { return _this.onLoad(); });
                        }
                        break;
                    }
                case 'video':
                    {
                        this.image = image;
                        this.bitmapType = 2 /* VIDEO */;
                        if (this.width == 0 || this.height == 0) {
                            throw new Error('width and height must be set when using canvas / video');
                        }
                        this.onLoad();
                        break;
                    }
                case 'canvas':
                    {
                        this.image = image;
                        this.bitmapType = 3 /* CANVAS */;
                        if (this.width == 0 || this.height == 0) {
                            throw new Error('width and height must be set when using canvas / video');
                        }
                        this.onLoad();
                        break;
                    }
            }
        }
        Bitmap.prototype.onLoad = function () {
            if (this.bitmapType == 1 /* IMAGE */) {
                this._imageNaturalWidth = this.image.naturalWidth;
                this._imageNaturalHeight = this.image.naturalHeight;
                if (!this.width) {
                    this.width = this._imageNaturalWidth;
                }
                if (!this.height) {
                    this.height = this._imageNaturalHeight;
                }
            }
            else {
                if (!this.width) {
                    this.width = this.image.width;
                }
                if (!this.height) {
                    this.height = this.image.height;
                }
            }
            this.isDirty = true;
            this.loaded = true;
            this.dispatchEvent(Bitmap.EVENT_LOAD);
        };
        Bitmap.prototype.addEventListener = function (name, listener, useCaption) {
            if (this.loaded && name == Bitmap.EVENT_LOAD) {
                listener.call(this);
            }
            else {
                _super.prototype.addEventListener.call(this, name, listener, useCaption);
            }
            return this;
        };
        Bitmap.prototype.isVisible = function () {
            var hasContent = this.cacheCanvas || this.loaded;
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        Bitmap.prototype.draw = function (ctx, ignoreCache) {
            if (_super.prototype.draw.call(this, ctx, ignoreCache)) {
                return true;
            }
            var sourceRect = this.sourceRect;
            var destRect = this.destinationRect;
            var width = this.width;
            var height = this.height;
            if (sourceRect && !destRect) {
                ctx.drawImage(this.image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, 0, 0, width, height);
            }
            else if (!sourceRect && destRect) {
                ctx.drawImage(this.image, 0, 0, width, height, destRect.x, destRect.y, destRect.width, destRect.height);
            }
            else if (sourceRect && destRect) {
                ctx.drawImage(this.image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
            }
            else {
                if (this.bitmapType == 1 /* IMAGE */) {
                    if (this._imageNaturalWidth == 0 || this._imageNaturalHeight == 0) {
                        this._imageNaturalWidth = this.image.naturalWidth;
                        this._imageNaturalHeight = this.image.naturalHeight;
                    }
                    if (this._imageNaturalWidth != 0 && this._imageNaturalHeight != 0) {
                        if (width == 0) {
                            this.width = width = this._imageNaturalWidth;
                        }
                        if (height == 0) {
                            this.height = height = this._imageNaturalHeight;
                        }
                        ctx.drawImage(this.image, 0, 0, this._imageNaturalWidth, this._imageNaturalHeight, 0, 0, width, height);
                    }
                }
                else {
                    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, width, height);
                }
            }
            return true;
        };
        Bitmap.prototype.tile = function (maxWidth, maxHeight) {
            var _this = this;
            if (maxHeight === void 0) {
                maxHeight = maxWidth;
            }
            if (this.loaded) {
                if (this.bitmapType != 1 /* IMAGE */) {
                    throw new Error('tiling is only possible with images');
                }
                if (this._imageNaturalWidth > maxWidth || this._imageNaturalHeight > maxHeight) {
                    if (this.width < maxWidth && this.height < maxHeight) {
                        this.cache(0, 0, this.width, this.height);
                    }
                    else {
                        this.cache(0, 0, this.width, this.height, Math.min(maxWidth / this.width, maxHeight / this.height));
                    }
                }
            }
            else {
                this.addEventListener(Bitmap.EVENT_LOAD, function () { return _this.tile(maxWidth, maxHeight); });
            }
            return this;
        };
        Bitmap.prototype.getBounds = function () {
            var rect = _super.prototype.getBounds.call(this);
            if (rect) {
                return rect;
            }
            var o = this.sourceRect || this.image;
            return this.loaded ? this._rectangle.setProperies(0, 0, o.width, o.height) : null;
        };
        Bitmap.prototype.getImageSize = function () {
            var width = 0;
            var height = 0;
            if (this.bitmapType == 0 /* UNKNOWN */ || this.bitmapType == 3 /* CANVAS */ || this.bitmapType == 2 /* VIDEO */) {
                var width = this.image.width;
                var height = this.image.height;
            }
            else if (this.bitmapType == 1 /* IMAGE */) {
                var width = this.image.naturalWidth;
                var height = this.image.naturalHeight;
            }
            return new Size(width, height);
        };
        Bitmap.prototype.clone = function () {
            var o = new Bitmap(this.image);
            if (this.sourceRect)
                o.sourceRect = this.sourceRect.clone();
            if (this.destinationRect)
                o.destinationRect = this.destinationRect.clone();
            this.cloneProps(o);
            return o;
        };
        Bitmap.prototype.toString = function () {
            return "[Bitmap (name=" + this.name + ")]";
        };
        Bitmap.prototype.destruct = function () {
            this.image = null;
            this.sourceRect = null;
            this.destinationRect = null;
            this._imageNaturalWidth = null;
            this._imageNaturalHeight = null;
            _super.prototype.destruct.call(this);
        };
        Bitmap.EVENT_LOAD = 'load';
        return Bitmap;
    })(DisplayObject);
    return Bitmap;
});
