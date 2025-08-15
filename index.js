document.addEventListener("click", function(event){
    const paw = document.createElement("img");
    paw.src= "images-base/paws.png";
    paw.className = "paw-click";
    paw.style.top = event.clientY + "px";
    paw.style.left = event.clientX + "px";

    document.body.appendChild(paw);

    paw.addEventListener("animationend", () => paw.remove());
});

function countUp(id, target, duration) {
  let start = 0;
  const stepTime = Math.abs(Math.floor(duration / target));
  const el = document.getElementById(id);
  
  const timer = setInterval(() => {
    start++;
    el.textContent = start;
    if (start >= target) {
      clearInterval(timer);
    }
  }, stepTime);
}

countUp("dogsNow", 23, 1000); 
countUp("dogsTotal", 184, 1500);
countUp("dogsYear", 47, 1200);

/* DOGS OBJECT */
const dogs = [
    {
        name: "Bianka",
        breed: "Rottweiler",
        age: 2,
        gender: "Female",
        health: "Healthy",
        image: "image-dogs/dog-bianka.jpg",
        description: "Most of my life I was kept on a chain. My owner simply abandoned me. I really love people, cuddling, and sitting on someone's laps. I adore playing with other dogs, but I don't really like cats... I want a home so badly — may I sit on your laps?",
    },

       {
        name: "Vasilisa",
        breed: "Rottweiler",
        age: 3,
        gender: "Female",
        health: "Healthy",
        image: "image-dogs/dog-vasilisa.jpg",
        description: "My previous owner didn’t love me or spend time with me, so I never really learned much or was loved. But I’ve got so much energy — and I use all of it to love people! I’m not the best at making friends with other dogs or cats, but with all my love for humans, and with you, my new best friend, I’ll play and have fun for as long as you want. Please take me home?",
    },

       {
        name: "Birdy",
        breed: "Mixed breed",
        age: 8,
        gender: "Female",
        health: "Serious health issues",
        image: "image-dogs/dog-birdy.jpg",
        description: "Most of my life felt like a real nightmare. I never went for walks or played outside, never felt a gentle touch… all they wanted from me was to have puppies. At first, I was scared of everything — I didn’t know what would happen to me. I am completely deaf and barely can walk...But now I’ve learned that not all humans are bad. Where are you, my perfect human?"
    },

       {
        name: "Archie",
        breed: "Rottweiler",
        age: 2,
        gender: "Male",
        health: "Minor health issues",
        image: "image-dogs/dog-archie.jpg",
        description: "I just adore people! My biggest talent? I’m the best at protecting them! I’m still learning how to walk on a leash and be a social butterfly, but I know for sure—someone out there is looking for a friend exactly like me.",
    },

       {
        name: "Baikal",
        breed: "Cane Corso",
        age: 6,
        gender: "Male",
        health: "Healthy",
        image:  "image-dogs/dog-baikal.jpg",
        description: "I’ve been at the shelter for over a year now… I might look a little scary, but deep down I’m the gentlest giant you’ll ever meet. I’m not the best with kids or people who smell like alcohol, but with everyone else, I’ll happily play with every toy in existence. I’m a good listener, I’m smart, and I'm chatty! I just really, really want to go home…",
    },

       {
        name: "Jessie",
        breed: "Rottweiler",
        age: 9,
        gender: "Female",
        health: "Serious health issues",
        image: "image-dogs/dog-jessie.jpg",
        description: "I really am a good girl, I promise. I love people so much… but they’ve let me down. I adore other animals… but they’ve hurt me too. I have cancer, but I’m not giving up! I just want to find my person and spend the rest of my life with them, surrounded by love and care.",
    },
]