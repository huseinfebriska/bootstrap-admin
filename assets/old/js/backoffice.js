$(document).ready(function(){ 
	/* Menu */
			
	/* System Message */
	$('div.system-message').slideDown(300).delay(2000).fadeOut(500);
			
	/* ------- Validate ------- */
	
	//Product
	$('#product-create').validate({
		rules: {
			code: "required",
			product_name: "required",
			category: "required",
			price1 : "required",
			size_type : "required"
		}
	});
	
	$('#product-edit').validate({
		rules: {
			product_name: "required",
			category: "required",
			price1 : "required"
		}
	});	
	
	//Category
	$('#category-create').validate({
		rules: {
			category_name: "required",
			qty_to_kg: "required"
		}
	});
	
	$('#category-edit').validate({
		rules: {
			category_name: "required",
			qty_to_kg: "required"
		}
	});
	
	//Size
	$('#size-type-create').validate({
		rules: {
			size_type_name: "required",
		}
	});
	
	$('#size-type-edit').validate({
		rules: {
			size_type_name: "required",
		}
	});
	
	$('#size-create').validate({
		rules: {
			size_type: "required",
			size_name_1: "required",
			metric_1: "required"
		}
	});
	
	$('#size-edit').validate({
		rules: {
			size_name_1: "required",
			metric_1: "required"
		}
	});

	//Color
	$('#color-create').validate({
		rules: {
			color_name: "required",
			hex_code: "required"
		}
	});
	
	$('#color-edit').validate({
		rules: {
			color_name: "required",
			hex_code: "required"
		}
	});
	
	//Stock
	$('#stock-edit').validate({
		rules: {
			edit_remarks: "required",
		}
	});
	
	//Delivery
	$('#delivery-create').validate({
		rules: {
			prov: "required",
			city_name: "required"
		}
	});
	
	$('#delivery-edit').validate({
		rules: {
			city_name: "required"
		}
	});
	
	//Payment
	$('#payment-create').validate({
		rules: {
			bank: "required",
			account_number: "required",
			holder_name: "required",
			branch: "required"
		}
	});
	
	$('#payment-edit').validate({
		rules: {
			bank: "required",
			account_number: "required",
			holder_name: "required",
			branch: "required"
		}
	});
	
	//Order
	$('#order-payment-confirm').validate({
		rules: {
			account: "required",
			payment_name: "required",
			payment_date: "required"
		}
	});
	
	$('#order-delivery-data').validate({
		rules: {
			delivery_date: "required",
			delivery_receipt_no: "required"
		}
	});

	//Create Order
	$('#create-order-form').validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			customer_name: "required",
			address: "required",
			postcode: "required",
			country: "required",
			phone: "required",
			province: "required",
			city: "required",
			shipping_cost: {
				required: true,
				number: true,
			},
		}
	})
	
	
	/*--------------------------- Pagination --------------------------- */
	
	/*--------------------------- End: Pagination --------------------------- */
	
	/*--------------------------- Stats Toggle --------------------------- */
	
	$("#stats-orders").click(function(){
		$('#chart_div2').hide();
		$('#chart_div').show();
		$("#li-stats-rupiah").removeClass('active');
		$("#li-stats-orders").addClass('active');
		
		return false;
	});
	
	$("#stats-rupiah").click(function(){
		$('#chart_div').hide();
		$('#chart_div2').show();
		$("#li-stats-rupiah").addClass('active');
		$("#li-stats-orders").removeClass('active');
		
		return false;
	});
	
	/* ###################################################################################################################### 
		Select Province
	###################################################################################################################### */

	$("#select-province").change(function() {
	
		$("#show-city").html('<img src="/assets/images/loader-form.gif" alt="Loading">');
		
		var province_id = $(this).val();
		if(province_id == '') {
					$("#show-city").html('<select id="select-city" name="city"><option value="">- Pilih provinsi terlebih dahulu -</option></select>');
		}
		else {
			$.post("/includes/form-select-city.inc.php", { action: "get_city", province_id: province_id },
			function(data){
				if(data == "error"){
					$("#show-city").html('<em>Gagal mendapatkan data kota.</em>');
				}
				else{
					$("#show-city").html(data);
				}
			});
		}
	});
	
	
	/* ###################################################################################################################### 
		Get shipping cost
	###################################################################################################################### */

	$(document).on("change", ".sipe-select-unique-city", function(e){
	
		$("#submit-create-order").addClass('disabled');
		$("#show-shipping-cost").html('<img src="/assets/images/loader-form.gif" alt="Loading">');
		
		var province = $('#select-province').val();
		var city = $('#select-city').val();
		var total_cart_qty = $('#total-cart-qty').val();
		
		if(city == '') {
			$("#show-shipping-cost").html('<em>Pilih kota terlebih dahulu.</em>');
		}
		else {
			$.post("/includes/form-select-shipping-method.inc.php", { action: "get_delivey_cost", province: province, city: city, total_cart: total_cart_qty },
			function(data){
				if(data == "error"){
					$("#show-shipping-cost").html('<em>Gagal mendapatkan data ongkos kirim.</em>');
				}
				else{
					$("#show-shipping-cost").html(data);
					$("#submit-create-order").removeClass('disabled');
				}
			});
		}
		
	});
	
	$(document).on("change", "#select-province", function(e){
	
		var province = $('#select-province').val();
		var city = $('#select-city').val();
		
		$("#submit-create-order").addClass('disabled');
		$("#show-shipping-cost").html('<em>Pilih kota terlebih dahulu.</em>');
		
		if(province == '88') {
			
			$.post("/includes/form-select-shipping-method.inc.php", { action: "get_delivey_cost", province: province, city: city },
			function(data){
				if(data == "error"){
					$("#show-shipping-cost").html('<em>Gagal mendapatkan data ongkos kirim.</em>');
				}
				else{
					$("#show-shipping-cost").html(data);
					$("#submit-create-order").removeClass('disabled');
				}
			});
		}
	});
	
	
	/* ###################################################################################################################### 
		Pass values on checkout shipping
	###################################################################################################################### */
	
	var shipping_method = null;
	var shipping_cost = 0;
	var total_pay = 0;
	
	
	$(document).on("click", "input[name='select_shipping_method']", function(e){
		var total_cart_price = parseInt($('#total-cart-price').val());
		shipping_method = this.value;
		
	    $("#pass-shipping-method").val(shipping_method);
	    
	    if(shipping_method == 'regular'){
	    	shipping_cost = parseInt($('#shipping-cost-regular').val());
	    	total_pay = total_cart_price + shipping_cost;
		    
	    }
	    else if(shipping_method == 'express'){
		    shipping_cost = parseInt($('#shipping-cost-express').val());
		    total_pay = total_cart_price + shipping_cost;
	    }
	    
	    $('#cart-sidebar-shipping-cost').html(currencyFormat(shipping_cost));
	    $('#pass-shipping-cost').val(shipping_cost);
	    $('#cart-sidebar-grand-total').html(currencyFormat(total_pay));
	    //$('#total-pay').val(total_pay);
	});


	// total pay if custom shipping cost
	$(document).on("keyup", "input[name='shipping_cost']", function(e){
		var total_cart_price = parseInt($('#total-cart-price').val());
		
		if (!isNaN(this.value) && this.value.length != 0) {
			$('#pass-shipping-cost').val(this.value);
			
		    total_pay = total_cart_price + parseInt(this.value);
		    $('#cart-sidebar-shipping-cost').html(currencyFormat(this.value));
		    $('#cart-sidebar-grand-total').html(currencyFormat(total_pay));
		    //$('#total-pay').val(total_pay);
	    }
	    else {
	    	$('#pass-shipping-cost').val(0);
		    $('#cart-sidebar-shipping-cost').html('<label class="error">Input ongkos kirim.</label>');
		    $('#cart-sidebar-grand-total').html('<label class="error">Input ongkos kirim.</label>');
		    //$('#total-pay').val(total_cart_price);
	    }
	});


	/* ###################################################################################################################### 
		Currency format
	###################################################################################################################### */
	
	function currencyFormat(nStr){
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1))
	    	x1 = x1.replace(rgx, '$1' + '.' + '$2');
		return x1 + x2;
	}

	
}); 
