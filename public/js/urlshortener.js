$(function() {
	$("#submitBtn").click(function() {
		var inputURL = $("#longURL").val();

		$.ajax({
			type: "POST",
			dataType: "json",
			data: {
				long_url: inputURL
			},
			url: "/api/v1/shorten",
			success: function(data) {
				$("#shortURL").text(data.long_url);
			}
		});

	});
});