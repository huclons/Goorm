module.exports={files:[],msg:function(e,t){var n={slide_url:t.slide_url,page:t.page};e.broadcast.to(t.workspace).emit("slideshare_message",n),e.emit("slideshare_message",n)}};