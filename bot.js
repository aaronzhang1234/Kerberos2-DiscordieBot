
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


var a=0;
var voted =[""];

var stackofid=[];
var prefix = "!f";

client.Dispatcher.on(Events.MESSAGE_CREATE,e=>{
    const content = e.message.content;
    const channel = e.message.channel;
    const guild = e.message.channel.guild;
    const author = e.message.author;

    //pings and testing
    if(content.indexOf("ping")==0) {
        channel.sendMessage("pong");
        console.log(prefix);
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
    if(content.indexOf("!vjoin")==0){

        const targetChannel = content.replace("!vjoin ","");

        var vchannel= guild.voiceChannels.find(channel=>channel.name.toLowerCase().indexOf(targetChannel)>=0);

        if(vchannel)
            vchannel.join();
    }


    if(content=="!vleave"){
        client.Channels
            .filter(channel=>channel.type== "voice" && channel.joined)
            .forEach(channel=>channel.leave());
    }


    //command to votekick someone
    if(content.indexOf("!startvotekick")==0){
        var p = guild._members;
        const personbanned = content.replace("!votekick @","");
        const personbannednogreat = personbanned.replace(">","");
        const idpersonbanned = personbannednogreat.substr(content.length-19);

        var personnum=0;
        console.log(idpersonbanned);

        for(var p=0;p<guild.member_count;p++) {
            if(idpersonbanned == guild.members[p].id){
                console.log("hello")
                personnum=p;
            }
            console.log(guild.members[p].id);
        }


        if(personnum!=0){
            channel.sendMessage("<@"+author.id+"> has started a vote to kick <@"+guild.members[personnum].id+">");
            setTimeout(function hello(){
                channel.sendMessage("VOTING IS OVER");
                channel.sendMessage(a+" people voted!");
                if(a==Math.ceil(guild.member_count/2)){
                    channel.sendMessage("goodbye <@"+guild.members[personnum].id+">");
                    guild.members[personnum].kick();
                }
                else{
                    channel.sendMessage("The votekick failed");
                }

                a=0;
                voted =[];
            },100000);

        }
       else{
            channel.sendMessage("please choose someone else to kick");
        }

    }

    //voting to kicksomeone.
    if(content.indexOf("votekick")==0){
        var didVote =false;
        console.log(author.discriminator);
        for(var o =0;o<voted.length;o++){
            if(voted[o]==author.discriminator){
                console.log(voted);
                didVote = true;
                channel.sendMessage("<@"+author.id+"> you already voted")
            }
        }
        if(!didVote){
            a++
            voted.push(author.discriminator);
            channel.sendMessage("<@"+author.id+"> has voted");
        }
    }

    if(content.indexOf("stack")==0){
        var instack = false;
        const personbanned = content.replace("stack @","");
        const personbannednogreat = personbanned.replace(">","");
        const idpersonbanned = personbannednogreat.substr(content.length-19);

        var personnum=0;

        for(var i=0,len =stackofid.length;i!==len;i++){
            if(stackofid[i][0]==idpersonbanned){
                instack = true;
                channel.sendMessage("There is already a vote going to kick this person");
            }
        }
        if(!instack){
            for(var p=0;p<guild.member_count;p++) {
                if(idpersonbanned == guild.members[p].id){
                    personnum=p;
                    stackofid.push([idpersonbanned,p,0]);
                    channel.sendMessage(idpersonbanned+ " has been stacked");
                }
            }
            setTimeout(function hello(){

                channel.sendMessage(stackofid[0][2] +" people voted to kick <@"+stackofid[0][0]+">");
                stackofid.shift();
            },30000)
        }
    }
    if(content.indexOf("kick")==0){
        var didvote=false;
        var isin=false;
        const personbanned = content.replace("stack @","");
        const personbannednogreat = personbanned.replace(">","");
        const idpersonbanned = personbannednogreat.substr(content.length-19);
        var loc=0;

        for(var i=0,len = stackofid.length;i!==len;i++){
            if(stackofid[i][0]==idpersonbanned){
                isin=true;
                loc =i;
            }
        }
        if(isin){
                for(var o =3,len2=stackofid[loc].length;o!==len2;o++){
                    if(stackofid[loc][o]==author.discriminator){
                        console.log(voted);
                        didVote = true;
                        channel.sendMessage("<@"+author.id+"> you already voted")
                    }
                }
                if(!didVote){
                    a++
                    stackofid[loc].push(author.discriminator);
                    console.log(stackofid[loc]);
                    stackofid[loc][2]++;
                    channel.sendMessage("<@"+author.id+"> has voted");
                }
        }
        else{
            channel.sendMessage("That person isn't in the stack right now, how about you stack them?");
        }

    }

    console.log(content);
});











