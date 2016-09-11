var sensorLib = require('node-dht-sensor');
var MilkCocoa = require('milkcocoa');
var milkcocoa = new MilkCocoa('your milkcocoa app');
var rp = require('request-promise');

var sensor = {
    initialize: function () {
        return sensorLib.initialize(11, 4);
    },
    read: function () {
        var readout = sensorLib.read();
        console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
            'humidity: ' + readout.humidity.toFixed(2) + '%');
        milkcocoa.dataStore('temp').push({
            'temperature': readout.temperature.toFixed(2),
            'humidity': readout.humidity.toFixed(2)
        });

        if (readout.temperature > 30) {
            var options = {
                method: 'POST',
                uri: 'your slack webhook',
                body: {
                    text: '現在の室温は' + readout.temperature.toFixed(2) + 'です'
                },
                json: true
            };

            rp(options)
            .then()
            .catch(function(err) {
                console.log(err);
            });
        }

        setTimeout(function () {
            sensor.read();
        }, 60000 * 10);
    }
};

if (sensor.initialize()) {
    sensor.read();
} else {
    console.warn('Failed to initialize sensor');
}

