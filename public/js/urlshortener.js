$(function() {
	$("#submitBtn").click(function() {
		var inputURL = $("#inputURL").val();

		$.ajax({
			type: "POST",
			dataType: "json",
			data: {
				longURL: inputURL
			},
			url: "/api/v1/shorten",
			success: function(data) {
				if (data.status_code === 200) {
					$("#inputURL").val(data.shortURL).select();
				} else if (data.status_code === 300) {
					alert("Invalid URL.");
				}
			}
		});

	});
});