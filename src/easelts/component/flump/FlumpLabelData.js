define(["require", "exports"], function (require, exports) {
    var FlumpLabelData = (function () {
        function FlumpLabelData(label, index, duration) {
            this.label = label;
            this.index = index;
            this.duration = duration;
        }
        return FlumpLabelData;
    })();
    return FlumpLabelData;
});
