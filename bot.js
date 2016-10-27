
//https://discordapp.com/oauth2/authorize?client_id=240242887143456768&scope=bot&permissions=0
var Discordie= require('discordie');
var cleverbot= require('cleverbot.io');


const Events = Discordie.Events;
const client = new Discordie();

var bot = new cleverbot('TYHRwNcZFicTF4xI','rKarZL4vSevwLDnjLXnGK7MRkBwud1W1');
bot.setNick("McMuffin");



client.connect({
    token :'MjQwMjQyODg3MTQzNDU2NzY4.CvAnEQ.el88s9cIOfUh7M6T3VtQ7CFNq9A'
});

client.Dispatcher.on(Events.GATEWAY_READY, e=>
    {
    console.log('Connected as: '+ client.User.Username);
    }
);




var stackofid=[]; //2d array to be used for banning people;

client.Dispatcher.on(Events.MESSAGE_CREATE,e=>{
    const content = e.message.content;
    const channel = e.message.channel;
    const guild = e.message.channel.guild;
    const author = e.message.author;

    const personbannednogreat = content.replace(">","");
    const idpersonbanned = personbannednogreat.substr(content.length-19);

    var len = stackofid.length;



    //pings and testing
    if(content.indexOf("ping")==0) {
        const personbannednogreat = content.replace(">","");
        const idpersonbanned = personbannednogreat.substr(content.length-19);

        channel.sendMessage("pong");

    }

    //help command
    if(content.indexOf("!help")==0)
           channel.sendMessage("!talk to talk to the bot");


    //cleverbot integration
    if(content.indexOf("!talk")==0) {
        //this is part of the cleverbot.io module
        bot.create(function(err, McMuffin) {
            bot.ask(content.substr(7),function(err,response){

                channel.sendMessage(response);
            })
        })
    }

    //8ball integration
    if(content.indexOf("!8ball")==0){
        var eightball = ["It is certain","It is decidedly so","Without a doubt", "Yes, definitely","Yes, definitely","You may rely on it",
            "As I see it, yes"," Most likely","Outlook good","Yes","Signs point to yes","Reply hazy try again","Ask again later","Better not tell you now",
            "Cannot predict now","Concentrate and ask again","Don't count on it","My reply is no","My sources say no","Outlook not so good",
            "Very doubtful"];
        channel.sendMessage(eightball[Math.floor(Math.random()*20)]);
    }


    //joining voice channels
    /*
    if(content.indexOf("!vjoin")==0){

        const targetChannel = content.replace("!vjoin ","");

        var vchannel= guild.voiceChannels.find(channel=>channel.name.toLowerCase().indexOf(targetChannel)>=0);

        if(vchannel)
            vchannel.join();
    }
    */


    //leaving all voice channels that the bot is in
    /*
    if(content=="!vleave"){
        client.Channels
            .filter(channel=>channel.type== "voice" && channel.joined)
            .forEach(channel=>channel.leave());
    }
    */


    //command to votekick someone
    if(content.indexOf("!startvotekick")==0){

        var instack = false;

        var personnum=0;

        for(var i=0;i!==len;i++){
            if(stackofid[i][0]==idpersonbanned){

                /*The person who is getting votekicked is already in the stack getting judged
                 */
                instack = true;
                channel.sendMessage("There is already a vote going to kick this person");
            }
        }
        if(!instack){
            for(var p=0;p<guild.member_count;p++) {
                if(idpersonbanned == guild.members[p].id){
                    //addding the person into the stack to get judged to get vote kicked

                    personnum=p;
                    stackofid.push([idpersonbanned,p,0]);
                    channel.sendMessage(idpersonbanned+ " has been stacked");
                }
            }
            setTimeout(function hello(){
                const votekicks = stackofid[0][2];
                const num = stackofid[0][1];
                const id = stackofid[0][0];

                channel.sendMessage(votekicks +" people voted to kick <@"+id+">");


                //if more than half the people in the chat vote yes, the person gets kicked
                if(votekicks >= Math.ceil(guild.member_count/2)){

                    channel.sendMessage("<@"+id+"> has been kicked");

                    guild.members[num].kick();
                }
                else{
                    channel.sendMessage("Not enough votes have been gathered to kick <@"+id+">");
                }
                stackofid.shift();
            },30000)
        }

    }



    /*voting to kick someone.
      the command would be !votekick @<username>
     */

    if(content.indexOf("!votekick")==0){
        var didVote=false;
        var isin=false;
        var loc=0;


        //seraching for if the person that you want to kick is in the stack to kick them
        for(var i=0;i!==len;i++){
            if(stackofid[i][0]==idpersonbanned){
                isin=true;
                loc =i;
            }
        }
        if(isin){
            for(var o =3,len2=stackofid[loc].length;o!==len2;o++){
                if(stackofid[loc][o]==author.discriminator){

                    //searching through the stack to see if the person who is voting has already voted
                    //if they find the person, they cannot vote twice
                    didVote = true;
                    channel.sendMessage("<@"+author.id+"> you already voted")
                }
            }
            if(!didVote){

                //if the person did not vote, add their id to the stack of people voting to kick the person
                //add one to the number of vote kicks
                //say to the plebs that they have voted

                stackofid[loc].push(author.discriminator);
                stackofid[loc][2]++;
                channel.sendMessage("<@"+author.id+"> has voted");
            }
        }
        else{

            //if the person has not had a vote on them, say it.
            channel.sendMessage("That person isn't in the stack right now, how about you stack them?");
        }
    }




    console.log(content);
});











