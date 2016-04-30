var express=require("express");
var app=express();
var https=require('https');
var view=[];


app.use(express.static(__dirname+'/public'));
console.log("Server is listening on 8080.......");
app.get('/api/imagesearch/:id',function(req,res){
    var date=new Date();
    var uobj={
        'term':req.params.id,
        'when':date.toUTCString()
    };
    view.push(uobj);
    var q=req.params.id.replace(" ","+");
    var options={
        host: 'www.googleapis.com',
        path: '/customsearch/v1?q='+q+'&cx=016146634643917433559%3Agddxft5mony&searchType=image&start='+req.query.offset+'&key=AIzaSyCYeJZzvZLIhnjpzBi5fAqBMnZjYi0dQPY'
    };
    https.request(options,function callback(response){
        var str="";
        response.on('data',function(chunk){
            str=str+chunk;
        });
        response.on('end',function(){
            var jstr=JSON.parse(str);
            var jarr=[];
            if(response.statusCode==200)
            {
            for(var x=0;x<jstr.items.length;x++)
            {
                var jobj={
                    'url':jstr.items[x].link,
                    'snippet':jstr.items[x].snippet,
                    'thumbnail':jstr.items[0].image.thumbnailLink,
                    'content':jstr.items[0].image.contextLink
                };
                jarr.push(jobj);
            }
            res.send(JSON.stringify(jarr));
            }
            else
            res.send(str);
        });
        
    }).end();
});
app.get('/api/latest/imagesearch/',function(req,res){
    res.send(JSON.stringify(view));
});
app.listen(process.env.PORT || 8080);