<script>
  const url = '/api/sendmail';
  const formData = {};

  const resetFields = () => {
    const form = document.querySelector('.form');
    const fields = form.elements;
    for (const field of fields) {
      field.value = '';
    }
  };

  let message = 'error';
  let formLoader;
  let messageEnabled = false;
  let buttonEnabled = true;
  const submitHandler = async (event) => {
    buttonEnabled = false;
    formLoader.style.visibility = 'visible';

    try {
      const promice = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(formData),
      });
      let status = promice.status;
      if (status == 200) {
        resetFields();
        message = 'Successful!';
        return;
      } else {
        const response = await promice.json();
        message = response.message;
      }
    } catch {
      message = 'Unexpexted error!';
    } finally {
      messageEnabled = true;
      buttonEnabled = true;
      formLoader.style.visibility = 'hidden';
    }
  };
</script>

<main>
  <form class="form" on:submit|preventDefault={submitHandler}>
    {#if messageEnabled}
      <p class="form__message">{message}</p>
    {/if}
    <h3>Email form</h3>
    <div class="form__loader" bind:this={formLoader}>
      <div class="loader" />
    </div>
    <div class="form__section">
      <input
        type="text"
        name="name"
        placeholder="Name"
        bind:value={formData.name}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        bind:value={formData.email}
      />
    </div>
    <div class="form__section">
      <textarea
        type="text"
        name="text"
        placeholder="Message"
        bind:value={formData.text}
      />
    </div>
    {#if buttonEnabled}
      <button>Send</button>
    {:else}
      <button disabled>Send</button>
    {/if}
  </form>
</main>

<style>
  :root {
    --form-background-color: #fff;
    --light-color: #eee;
    --dark-color: #000;
    --button-hover-color: gray;
    --loader-color: gray;
  }
  main {
    margin: 0;
    display: flex;
    min-height: 100vh;
  }
  * {
    box-sizing: border-box;
  }

  .form {
    background-color: var(--form-background-color);
    border-radius: 5px;
    padding: 20px;
    width: 700px;
    margin: auto;
    display: grid;
    gap: 20px;
    position: relative;
    border: 1px solid var(--light-color);
  }

  .form__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    visibility: hidden;
  }

  .form__section {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .form input,
  .form textarea,
  .form button {
    background-color: var(--light-color);
    outline: none;
    border: 1px solid var(--light-color);
    border-radius: 3px;
    padding: 10px;
  }

  .form input {
    width: 300px;
  }

  .form textarea {
    height: 300px;
    width: 100%;
    resize: none;
  }

  .form button {
    width: 100px;
    cursor: pointer;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .form button:hover {
    color: var(--button-hover-color);
  }

  .form__message {
    background-color: var(--form-background-color);
    margin-top: 0;
    margin-bottom: 0;
    position: absolute;
    padding: 10px;
    top: -60px;
    left: 0;
    width: 100%;
    border-radius: 5px;
    color: var(--dark-color);
  }

  .loader {
    display: inline-block;
    width: 80px;
    height: 80px;
  }
  .loader:after {
    content: ' ';
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid;
    border-color: var(--button-hover-color) transparent
      var(--button-hover-color) transparent;
    animation: loader 1.2s linear infinite;
  }
  @keyframes loader {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
