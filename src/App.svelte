<script>
	let emailValue = "";
	let nameValue = "";
	let messageValue = "";
	const url = '/api/sendmail'

	const FormSelectors = {
		FORM: 'form',
    	LOADER: '.form__loader',
	};


	const getFormData = (form) => {
    	const formData = {};
    	new FormData(form).forEach((value, key) => {
        	formData[key] = value;
    	});
    	return formData;
	};
	
	const resetFields = (form) => {
    	const fields = form.querySelectorAll('input, textarea');
    	for (const field of fields) {
        	field.value = '';
    	}
	};

	const showFormMessage = (message, isError = false) => {
		const formMessage = document.querySelector('.form__message');
    	formMessage.innerText = message;

    	if (isError) {
    	    formMessage.classList.add('form__error');
   	 	} else {
   	     	formMessage.classList.remove('form__error');
   	 	}
   	 	formMessage.style.visibility = 'visible';
		};

	const submitHandler = async (event) => {
		const form = document.querySelector('form');
		const formLoader = document.querySelector('.form__loader')

		document.getElementById('button').disabled = true;
    	formLoader.style.visibility = 'visible';

		const formData = getFormData(form);
		console.log(formData);
		try {
        const response = await fetch(url, {
 		method: 'POST',
  		headers: {
    	'Content-Type': 'application/json;charset=utf-8'
  		},
  		body: JSON.stringify(formData)
		});

        if (response.error) {
            throw response;
        } else {
            showFormMessage(response.message);
            resetFields(form);
        }
    } catch (exception) {
        showFormMessage(exception?.error || 'Unknown error. Try again.', true);
    }

    document.getElementById('button').disabled = false;
    formLoader.style.visibility = 'hidden';
};
</script>

<main>
    <form class="form" on:submit|preventDefault={submitHandler}>
      <p class="form__message">Error</p>
      <h3>Email form</h3>
      <div class="form__loader">
        <div class="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
	  
      <div class="form__section">
        <input type="text" name="name" placeholder="Name" on:input={event =>(nameValue = event.target.value)}/>
        <input type="email" name="email" placeholder="Email" on:input={event =>(emailValue = event.target.value)}/>
      </div>
      <div class="form__section">
        <input type ="text" name="text" placeholder="Message" on:input={event =>(messageValue = event.target.value)}/>
      </div>
      <!--<input id="button" class ="form__submit" type = "submit" value="Send" on:click= {submitHandler}/>-->
	  <button id="button" class="form__submit" on:click= {submitHandler}>Send</button>
    </form>
</main>

<style>
	
</style>