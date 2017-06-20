var restify = require('restify');
var builder = require('botbuilder');
var rp = require('request-promise');

//var SearchKey = process.env.BINGSEARCHKEY;
//var ComputerVisionKey = process.env.CVKEY;

// Get secrets from server environment
var botConnectorOptions = {
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
};

// Create bot
var connector = new builder.ChatConnector(botConnectorOptions);
var bot = new builder.UniversalBot(connector);

bot.dialog('/', function (session) {

    //respond with user's message
    //this will send you said+what ever user says.
    session.send("you said " + session.message.text);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//var luisRecognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/3b11159b-2a95-433e-aa99-1c7c99bb8452?subscription-key=de3edb6083aa47b5aa2b1957f956284a&staging=true&timezoneOffset=0&verbose=true&q=');
//var intentDialog = new builder.IntentDialog({ recognizers: [luisRecognizer] });
//bot.dialog('/', intentDialog);

//intentDialog.matches(/\b(hi|hello|hey|howdy)\b/i, '/sayHi') //Check for greetings using regex
//    .matches('getNews', '/topnews') //Check for LUIS intent to get news
//    .matches('AnalyseImage', '/analyseImage') //Check for LUIS intent to analyze image
//    .onDefault(builder.DialogAction.send("Sorry, I didn't understand what you said.")); //Default message if all checks fail

//bot.dialog('/sayHi', function (session) {
//    session.send('Hey, Adi!  Try saying things like "Get news"');
//    session.endDialog();
//});

//bot.dialog('/analyseImage', [
//    function (session) {
//        builder.Prompts.text(session, "Send me an image link of it please.");
//    },
//    function (session, results) {
//        //Options for the request
//        var options = {
//            method: 'POST',
//            uri: 'https://southeastasia.api.cognitive.microsoft.com/vision/v1.0/describe?maxCandidates=1',
//            headers: {
//                'Ocp-Apim-Subscription-Key': ComputerVisionKey,
//                'Content-Type': 'application/json'
//            },
//            body: {
//                //https://heavyeditorial.files.wordpress.com/2016/05/harambe-22.jpg?quality=65&strip=all&strip=all
//                url: results.response
//            },
//            json: true
//        }
//        //Make the request
//        rp(options).then(function (body) {
//            // Send the caption
//            session.send("I think it's " + body.description.captions[0].text)
//        }).catch(function (err) {
//            console.log(err.message);
//            session.send(prompts.msgError);
//        }).finally(function () {
//            session.endDialog();
//        });
//    }
//]);

//bot.dialog('/topnews', [
//    function (session) {
//        // Ask the user which category they would like
//        // Choices are separated by |
//        builder.Prompts.choice(session, "Which category would you like?", "Technology|Science|Sports|Business|Entertainment|Politics|Health|World|(quit)");
//    }, function (session, results, next) {
//        // The user chose a category
//        if (results.response && results.response.entity !== '(quit)') {
//            //Show user that we're processing their request by sending the typing indicator
//            session.sendTyping();
//            // Build the url we'll be calling to get top news
//            var url = "https://api.cognitive.microsoft.com/bing/v5.0/news/?"
//                + "category=" + results.response.entity + "&count=10&mkt=en-US&originalImg=true";
//            // Build options for the request
//            var options = {
//                uri: url,
//                headers: {
//                    'Ocp-Apim-Subscription-Key': SearchKey
//                },
//                json: true // Returns the response in json
//            }
//            //Make the call
//            rp(options).then(function (body) {
//                // The request is successful
//                sendTopNews(session, results, body);
//            }).catch(function (err) {
//                // An error occurred and the request failed
//                console.log(err.message);
//                session.send("Argh, something went wrong. :( Try again?");
//            }).finally(function () {
//                // This is executed at the end, regardless of whether the request is successful or not
//                session.endDialog();
//            });
//        } else {
//            // The user choses to quit
//            session.endDialog("Ok. Mission Aborted.");
//        }
//    }
//]);

//// This function processes the results from the API call to category news and sends it as cards
//function sendTopNews(session, results, body) {
//    session.send("Top news in " + results.response.entity + ": ");
//    //Show user that we're processing by sending the typing indicator
//    session.sendTyping();
//    // The value property in body contains an array of all the returned articles
//    var allArticles = body.value;
//    var cards = [];
//    // Iterate through all 10 articles returned by the API
//    for (var i = 0; i < 10; i++) {
//        var article = allArticles[i];
//        // Create a card for the article and add it to the list of cards we want to send
//        cards.push(new builder.HeroCard(session)
//            .title(article.name)
//            .subtitle(article.datePublished)
//            .images([
//                //handle if thumbnail is empty
//                builder.CardImage.create(session, article.image.contentUrl)
//            ])
//            .buttons([
//                // Pressing this button opens a url to the actual article
//                builder.CardAction.openUrl(session, article.url, "Full article")
//            ]));
//    }
//    var msg = new builder.Message(session)
//        .textFormat(builder.TextFormat.xml)
//        .attachmentLayout(builder.AttachmentLayout.carousel)
//        .attachments(cards);
//    session.send(msg);
//}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Setup Restify Server
var server = restify.createServer();

// Handle Bot Framework messages
/*here we are giving path as "/api/messages" because during the process of regi9stering bot we have given end point URL as "azure qwebapp url/api/messages" if you want to give some other url give the same url whatever you give in the endpoint excluding azure webapp url */
server.post('/api/messages', connector.listen());

// Serve a static web page
server.get(/.*/, restify.serveStatic({
    'directory': '.',
    'default': 'index.html'
}));

server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});