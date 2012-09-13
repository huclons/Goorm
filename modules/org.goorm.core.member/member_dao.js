//스키마
var schema = {
	id: String,
	auth_type: String,
	pw: String,
	name: String,
	nick: String,
	email: String,
	email_chk: Boolean,
	level: Number,         //회원 레벨. 10=최고관리자, 0=로그인안함
	point: Number,
	deleted: Boolean,		//탈퇴시 완전 지우는게 아니라 플래그만 바꿔줌
	extra: String
};

var Member = mongoose.model('member', new Schema(schema));

module.exports = {
	//회원을 추가한다. callback(Boolean result)
	add: function(new_member, callback){
		//DB 스키마의 Document 모델 인스턴스를 생성한다. 
		var doc = new Member();
		for(var attrname in schema){
			doc[attrname] = new_member[attrname];
		}
		doc.deleted = false;
		
		//저장
		doc.save(function (err) {
		    if (!err){
		    	callback(true);
		    }else{
		    	console.log(err, 'dao.member : Member add failed');
		    	callback(false);
		    }
		});
	},
	
	//회원 정보를 가져온다. callback(Member member)
	get: function(id, callback){
		Member.findOne({id: id}, function(err, result){
			//값을 불러와서
			if ( result ) {
				//클래스 인스턴스를 반환
				var ret={};
				for(var attrname in schema){
					ret[attrname] = result[attrname];
				}
				callback(ret);
			}else{
				callback(false)
			}
		});
	},
	
	//회원 정보를 가져온다. callback(Member member)
	get_by_nick: function(nick, callback){
		Member.findOne({nick: nick}, function(err, result){
			if ( result ) {
				var ret={};
				for(var attrname in schema){
					ret[attrname] = result[attrname];
				}
				callback(ret);
			}else{
				callback(false)
			}
		});
	},
	
	//회원 삭제 
	remove: function(id, callback){
		console.log(id);
		Member.update({id: {$in: id}},{$set:{deleted:true}}, {multi:true}, function(err){
		//Document.remove({id: {$in: id}}, function(err){
			if ( !err) {
				callback(true);
			} else {
				console.log('member_dao : Member Removing [fail]');
				callback(false);
			}
		});
	},
	
	//회원 정보를 변경한다. callback(Boolean result)
	set: function(id, new_member, callback){
		var member = {};
		for(var attrname in new_member){
			member[attrname] = new_member[attrname];
			if(member[attrname] == 'false') member[attrname] = false;
			if(member[attrname] == 'true') member[attrname] = true;
		}
		console.log(member);
		Member.update({id:id}, {$set:member}, null, function(err){
			if ( !err ) {
				console.log('member_dao : Member updating [success]');
				callback(true);	//성공
			} else {
				console.log('member_dao : Member updating [fail]', err);
				callback(false); //실패
			}
		});
	},
	//전체 회원 목록을 받아온다.
	get_list: function(callback){
		Member.find({deleted:false}, function(err, result){
			if(!err){
				callback(result);
			}else{
				callback(null);
			}
		});
	}
}
