$(function() {
	var $txtPostChat = $("#txtPostChat");
	var $chats = $("#chats");

	var pubnub = PUBNUB.init({
		publish_key: 'pub-c-2847b0c9-ed1b-4f6b-92c5-762ab58f3528',
		subscribe_key: 'sub-c-58b0774a-e285-11e4-aa77-0619f8945a4f'
	});

	pubnub.subscribe({
		channel: 'testing',
		message: function(msg) {
			console.log('recv', msg);

			$chats.append('<li>' + msg.author + ': ' + msg.content + '</li>');
		}
	});

	$("#frmPostChat").submit(function() {
		pubnub.publish({
			channel: 'testing',
			message: {
				author: app.user.name,
				content: $txtPostChat.val()
			}
		});

		return false;
	});
});
