$(function() {
	$("#submitBtn").click(function() {
		var inputURL = $("#longURL").val();

		$.ajax({
			type: "POST",
			dataType: "json",
			data: {
				longURL: inputURL
			},
			url: "/api/v1/shorten",
			success: function(data) {
				$("#shortURL").text(data.shortURL);
			}
		});

	});
});