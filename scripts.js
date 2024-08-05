document.addEventListener('DOMContentLoaded', function () {
    const switchers = [...document.querySelectorAll('.switcher')];

    switchers.forEach(item => {
        item.addEventListener('click', function() {
            switchers.forEach(item => item.parentElement.classList.remove('is-active'));
            this.parentElement.classList.add('is-active');
        });
    });

    
    document.querySelector('.switcher-signup').parentElement.classList.add('is-active');
    document.querySelector('.switcher-login').parentElement.classList.remove('is-active');







    const signupForm = document.querySelector('.form-signup');
    
    
    signupForm.addEventListener('submit', async function(event) {
        
        event.preventDefault();
        
        //signup
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
         console.log("username:"+username+"\nemail:"+email+"\npassword:"+password)
        
        try {
            const response = await fetch('http://127.0.0.1:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password})
            });

            const result = await response.text();
            
            
        } catch (error) {
            console.error('Error:', error);
        }




        //login
        
    });

     const loginform= document.querySelector(".form-login");
     loginform.addEventListener('submit',async ()=>{
        const email=document.getElementById("login-email").value;
        const password=document.getElementById("login-password").value;




        try {
            const response = await fetch('http://127.0.0.1:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({  email, password })
            });

            const result = await response.text();
            
            
        } catch (error) {
            console.error('Error', error);
        }
     })
});