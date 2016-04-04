// nodejs.org
// npm install --save watson-developer-cloud
// bluemix.net
// ibm.com/watsondevelopercloud

var fs = require('fs');
var watson = require('watson-developer-cloud');
var wav = require('wav');
var Speaker = require('speaker');
var auth = require('./auth.js'); // you'll have to edit this file to include your credentials

var ta = watson.tone_analyzer(auth.tone_analyzer);

var myText = "Greetings from Watson Developer Cloud";

// analyze the tone of the text
ta.tone({text: myText}, function(err, result) {
   if (err) {
       return console.log(err);
   }
   console.log(JSON.stringify(result, null, 2));
});

var lt = watson.language_translation(auth.language_translation);
var tts = watson.text_to_speech(auth.text_to_speech);

// translate the text from english to spanish
lt.translate({
    text: myText,
    source: 'en',
    target: 'es'
}, function(err, result) {
    if (err) {
        return console.log(err);
    }
    console.log(JSON.stringify(result, null, 2));
    
    // synthesize the translated text using a spanish voice
    var ttsStream = tts.synthesize({
        text: result.translations[0].translation,
        accept: 'audio/wav',
        voice: 'es-ES_LauraVoice'
    });
    
    // pipe to a local file
    ttsStream.pipe(fs.createWriteStream('output.wav'));
    
    // and/or pipe to a wav reader and then the speakers
    var reader = new wav.Reader();
    ttsStream.pipe(reader)
    .on('format', function(format) {
        result.pipe(new Speaker(format));
    });
});
