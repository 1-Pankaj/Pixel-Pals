/* Message data, part 1: greetings, time of day, weekdays, special dates and reactions.
   Add your own lines freely; every list is just an array of strings.
   An entry can also be [text, mood] to force a facial expression. */
(function (g) {
  const D = (g.MessageData = g.MessageData || {});

  D.core = {
    /* ───────── greetings when the pet appears ───────── */
    greet: {
      morning: [
        "Good morning! I saved you the sunniest spot.",
        "Morning! Today is a fresh page. Let's make it a good one.",
        "You're up! I've been practising my best stretch for you.",
        "Rise and shine! I'll cheer from right here.",
        "Good morning! Water first, world second.",
        "Hello, early bird! I like your style.",
        "A brand new day, and you brought me along. Lucky me!",
        "Morning! Everything is a little softer before noon.",
      ],
      afternoon: [
        "Good afternoon! I was hoping you'd show up.",
        "Hey you! The day's half done and you're still doing great.",
        "Afternoon! Perfect time for a tiny stretch.",
        "Oh, hello! I just woke up from the most excellent nap.",
        "Welcome! Your spot is warm and I kept an eye on it.",
        "Good afternoon! I brought nothing but good vibes.",
        "Hi hi hi! Is it snack o'clock yet?",
        "Afternoon! Let's keep the good momentum rolling.",
      ],
      evening: [
        "Good evening! You made it through the day.",
        "Evening! Time to slow down a little, okay?",
        "Hello! The best part of the day is when you say hi.",
        "Welcome back! Let's end the day gently.",
        "Evening already! I'm so proud of you for today.",
        "Hi there. Cozy mode is available whenever you want it.",
        "Good evening! The sky is doing its pretty thing.",
        "You're here! Let's make this part of the day a calm one.",
      ],
      night: [
        "Hi night owl! I'll keep you company.",
        "It's getting late. I'm here, I'm cozy, I'm yours.",
        "Good evening! Quiet hours are my favourite hours.",
        "Hello! Everything feels peaceful right now, doesn't it?",
        "Night shift? I brought moral support.",
        "Hey, you. I'll stay up with you for a bit.",
        "Hi! The night is soft and so am I.",
        "Welcome! Remember to rest your eyes soon.",
      ],
      late: [
        "Whoa, it's very late! I'll keep the lights low.",
        "Still up? I'll stay with you, but sleep is lovely too.",
        "It's the middle of the night. Be kind to yourself, okay?",
        "Hello, midnight friend. Don't forget to rest.",
        "The world is asleep. I'm half asleep. Hi.",
        "Late night company reporting for duty, yawning included.",
        "Everything is quiet. Perfect for a gentle cuddle of a thought.",
        "You're up late! Sleep is a superpower, you know.",
      ],
    },

    /* ───────── when the user returns after being away ───────── */
    back: [
      "You're back! I missed you a whole lot.",
      "There you are! I kept your spot warm.",
      "Welcome back! I only napped a little. Okay, a lot.",
      "Oh! You're here! Happy dance incoming.",
      "I was dreaming about you. Good timing!",
      "Hi again! Did you have a good break?",
      "Yay, you returned! Nothing exciting happened. It was boring without you.",
      "Welcome back! I guarded everything. Mostly with my eyes closed.",
      "The best part of waking up is you.",
      "You're back and I'm so happy I could wiggle.",
    ],

    /* ───────── new pet adopted ───────── */
    adopt: [
      "Hi! I'm so happy you picked me!",
      "Hello, new best friend!",
      "Me? Really? Okay, I'm yours now.",
      "I'll take very good care of your desktop.",
      "Nice to meet you! Where are we going first?",
      "Yay! My very own human!",
      "I promise to be extremely cute at all times.",
      "Hello! Please pet me whenever you like.",
    ],

    /* ───────── goodbye on quit ───────── */
    bye: [
      "See you soon! I'll dream of you.",
      "Bye for now! Be kind to yourself.",
      "Going to nap. Come back soon!",
      "Take care! I'll be right here.",
      "Goodnight! Or good day. Either way, bye!",
      "Okay, bye bye! Don't forget me.",
      "Until next time, my friend.",
      "Sweet dreams to both of us!",
    ],

    /* ───────── time-of-day chatter ───────── */
    time: {
      morning: [
        "Mornings are for slow starts and good snacks.",
        "Fresh day, fresh page, fresh start.",
        "The sun is up, and so is my enthusiasm. Mostly.",
        "A tiny stretch might feel really good right now.",
        "Don't skip breakfast. Your future self says thanks.",
        "Morning light makes everything look hopeful.",
        "Today can be small and still be a good day.",
        "Whatever you do this morning, do it gently.",
        "Is it too early for a snack? Never.",
        "A glass of water makes a great first teammate.",
      ],
      afternoon: [
        "Afternoon slump? A little walk can help.",
        "Halfway through the day. You're doing better than you think.",
        "This is a great time for a short stretch break.",
        "The afternoon sun is perfect for sitting still and thinking.",
        "Remember lunch! Real food, real chewing.",
        "A short pause now makes the rest of the day easier.",
        "Look at something far away for a moment. Your eyes will love it.",
        "I vote for a snack. It's a very democratic pet.",
        "The day isn't over. Neither are you.",
        "Little breaks are not wasted time.",
      ],
      evening: [
        "The day is winding down. Be proud of what you did.",
        "Evenings are for soft lights and slow thoughts.",
        "You don't have to finish everything today.",
        "Dinner time soon? I'm ready to help supervise.",
        "The sky is changing colours. Take a peek if you can.",
        "Time to start putting today down, little by little.",
        "A warm drink and a quiet minute could be lovely.",
        "I hope today had at least one good moment.",
        "Whatever's left can wait for tomorrow.",
        "Evening feels like a gentle hug from the day.",
      ],
      night: [
        "The night is calm. Let your shoulders drop.",
        "Try dimming the lights a little. Your eyes will relax.",
        "Bedtime is secretly a great idea.",
        "Tomorrow-you will be grateful for tonight's rest.",
        "Stars are out! Even if we can't see them from here.",
        "Everything can wait. Rest is productive too.",
        "A calm breath in, and a slow breath out.",
        "Let's wrap up soon and get cozy.",
        "Goodnight thoughts only, please.",
        "Quiet is my favourite sound.",
      ],
      late: [
        "It's really late. Sleep makes everything better tomorrow.",
        "Your bed misses you. It told me.",
        "Late night thoughts are loud. Rest makes them quieter.",
        "Are you sure it can't wait until tomorrow?",
        "I'll stay up with you, but I'd rather you slept.",
        "Even night owls need to recharge.",
        "Please drink some water and rest your eyes.",
        "The best idea tonight might be a good sleep.",
        "Tiny reminder: you matter more than any deadline.",
        "Yawn... sorry. It's contagious, isn't it?",
      ],
    },

    /* ───────── weekday chatter (0 = Sunday) ───────── */
    week: [
      [
        "Happy Sunday! Slow is the correct speed today.",
        "Sundays are for pyjamas and not worrying.",
        "A soft Sunday is a gift. Open it slowly.",
        "Rest today. Tomorrow can introduce itself later.",
      ],
      [
        "It's Monday! You've handled every Monday so far.",
        "Monday is just a Sunday in a work outfit.",
        "Small steps count, especially on Mondays.",
        "New week, clean slate. I believe in you.",
      ],
      [
        "Tuesday! The week has found its rhythm.",
        "Happy Tuesday. You're already past the hardest day.",
        "Tuesdays are underrated. Quiet and capable.",
        "Keep going, you've got this Tuesday in the bag.",
      ],
      [
        "Wednesday! You're right in the middle. Nicely done.",
        "Hump day! I'd jump over it, but I'm tiny.",
        "Halfway through the week. Pat yourself on the back.",
        "Midweek reminder: you're doing great.",
      ],
      [
        "Thursday! The weekend is waving at us.",
        "Almost Friday. I can smell it.",
        "Thursday is Friday's cool little sibling.",
        "One more push, then the cozy zone begins.",
      ],
      [
        "Friday! The most wiggly day of the week.",
        "It's Friday! Please enjoy at least one thing today.",
        "Friday energy: unlocked.",
        "Nearly the weekend! Finish gently and celebrate a bit.",
      ],
      [
        "Saturday! Nothing is required of you.",
        "Happy Saturday. Go do something you actually enjoy.",
        "Weekend mode: engaged. Snacks: encouraged.",
        "Saturdays are made for long naps and good ideas.",
      ],
    ],

    /* ───────── special dates (MM-DD) ───────── */
    special: {
      "01-01": ["Happy New Year! A whole fresh year to be cute in.", "New year, same wonderful you. Maybe with more snacks.", "Happy New Year! Let's make small good things happen."],
      "01-26": ["Happy Republic Day to everyone celebrating!", "Sending warm Republic Day wishes your way."],
      "02-14": ["Happy Valentine's Day! You're my favourite person.", "Love is in the air. Also treats, hopefully.", "Today I'm giving out invisible hearts. Take as many as you like."],
      "03-14": ["Happy Pi Day! I'd like a slice, any kind.", "3.14159... that's all I know. Delicious, though."],
      "04-01": ["Psst. I didn't eat your cursor. April Fools!", "Today I'm pretending to be a very serious pet. Is it working?"],
      "04-22": ["Happy Earth Day! Hug a tree, or at least a plant.", "Take care of the planet. It has been so good to us."],
      "08-08": ["It's International Cat Day! Treats for everyone.", "Cat day! Fine, all pets can celebrate."],
      "08-15": ["Happy Independence Day to everyone celebrating!", "Warm wishes for a bright Independence Day."],
      "10-04": ["Happy World Animal Day! That's my day, isn't it?", "Today is for animals everywhere. Give someone a pat!"],
      "10-31": ["Happy Halloween! Boo! ...Did I scare you? No? Fine.", "Spooky season! I'm very frightening. Just kidding.", "Trick or treat! I'll take the treat, please."],
      "12-24": ["It's Christmas Eve! I'm too excited to sit still.", "Warm wishes for tonight. Hot cocoa is recommended."],
      "12-25": ["Merry Christmas! My gift to you is infinite cuddles.", "Happy holidays! You're the best gift I got."],
      "12-31": ["Last day of the year! Look how far you've come.", "Happy New Year's Eve! Be proud of this whole year."],
    },

    /* ───────── reactions ───────── */
    petted: [
      "Hehe, that tickles.", "More pets, please.", "I love this. Don't stop.", "You have the best hands.",
      "Purr... I mean, hello!", "Yes, right there.", "I'm melting into a puddle.", "You're my favourite human.",
      "That's the spot!", "Awww, I needed that.", "My heart goes boing.", "Five stars. Would be petted again.",
      "You make everything better.", "Thank you for the love!", "Okay, I'm officially soft now.", "Best part of my day.",
      "Pet pet pet pet pet!", "Careful, I might never let go.", "Warm and fuzzy feelings!", "That's a very good pet.",
      "I'm so happy I could wiggle.", "Squishy happy feelings!", "You deserve a treat too.", "I knew you'd come by.",
      "Hee hee!", "Ooh, gentle. Perfect.", "You're so nice to me.", "Aww, you noticed me!",
    ],
    petSpam: [
      "Okay okay, that's plenty!", "Hey, I'm not a doorbell.", "So many pets! My head is spinning.", "Hehe, easy there.",
      "Oh my, that's a lot of love.", "Too many pets! Too happy!", "Is this a tickle attack?", "My ears are going to fall off!",
      "You're enthusiastic today!", "Pat pat pat. I counted.", "Slow down, I'm only tiny!", "Do I get a treat for this?",
      "I might dizzy over here...", "I'm getting overwhelmed with joy.",
    ],
    dizzy: [
      "Whoaaa... everything is spinning.", "Too much! Pretty stars though.", "I see tweeting birds.", "My brain went wheee.",
      "Okay... I need to lie down.", "Is the room round? I think it's round.", "Dizzy dizzy dizzy.", "Give me a second, I'm spinning.",
      "Stars! Lots of stars.", "I think I enjoyed that? Maybe?",
    ],
    lifted: [
      "Whoa! I'm flying!", "Put me down gently, please!", "Wheee! A tour!", "Eek! My feet aren't touching anything.",
      "Where are we going?", "I'm up high! Be careful!", "I trust you, but, wow.", "I'm a bird now.",
      "This is a new view!", "Hold on, hold on!", "Is this my new home?", "Careful, I'm precious cargo.",
      "Fancy ride!", "Woah, the desktop looks tiny from here.", "Weeeeee!", "Don't drop me, okay?",
    ],
    dropped: [
      "Landed it!", "Ta-da! Perfect landing.", "New spot. I like it.", "Okay, that's a fine place to be.",
      "Whew. Solid ground.", "That was a thrill!", "I can see the whole screen from here.", "A little bump, but I'm okay.",
      "Nice choice of spot!", "This corner has good vibes.", "Everything looks different over here.", "Home sweet new home.",
      "Boing! Safe and sound.", "Hello, new neighbourhood.",
    ],
    fed: [
      "Yum! That was delicious.", "Nom nom nom!", "Thank you for the snack!", "Best treat ever.",
      "My tummy is happy.", "Is there more? Just asking.", "You spoil me.", "Crunch crunch. Love it.",
      "That hit the spot.", "Delicious! You're the best.", "Mmm. Perfect.", "Snack time is the best time.",
      "I'd marry this snack.", "Thank you thank you thank you!", "Full and happy.", "I will remember this kindness forever.",
      "That was a five-star meal.", "So tasty!",
    ],
    trick: [
      "Ta-da!", "How was that?", "I've been practising all day.", "Fancy, right?",
      "Applause accepted.", "I'm basically a professional.", "Wow, I even surprised myself.", "Ready for round two?",
      "That one's a classic.", "A little something I made up.", "Do I get a prize?", "Hup!",
      "Spin to win!", "Everyone's a star when they dance.",
    ],
    startled: [
      "Eek!", "Whoa, you startled me!", "Don't sneak up on me!", "My heart skipped a beat!",
      "Boo! ...Oh, it's only you.", "Oh! Hi!", "You're fast!", "I was just looking at nothing.",
    ],
    wake: [
      "Mmm... I'm awake. Hi.", "Oh! I dozed off for a second.", "Yawn... hello again.", "Is it morning already?",
      "Hmm? I was just resting my eyes.", "Five more minutes... okay, I'm up.", "I had the loveliest dream.", "Back in action!",
      "Oh, hi! Did I miss anything?", "That was a good nap.", "Huh? Who? Oh, you!", "Stretch, blink, ready.",
      "I wasn't sleeping. I was meditating.", "Hi again, sleepyhead. Wait, that's me.",
    ],
    sleepTalk: [
      "zzz... snacks...", "mm... five more minutes...", "zzz... tiny fish...", "...is that a butterfly?...",
      "zzz... cuddles...", "mmh... yes please...", "...don't go... zzz...", "...so soft...",
      "...zzz... bouncy...", "zzz... one more nap...", "...ooh, pancakes...", "...mm, cozy...",
    ],
    bored: [
      "Hello? I'm right here.", "I'm a little lonely. Just a little.", "Hey, did you forget about me?", "Psst. Pets are free.",
      "I've counted all the pixels around me.", "Is anyone out there?", "I'm being very patient.", "Even a tiny wave would make my day.",
      "I might need a hug.", "Do you need anything? I'm available.", "Just checking you're still there.", "Staring at the screen with you.",
    ],
    hover: [
      "Hi! Need me?", "Yes? Yes?", "You're so close!", "Are you going to pet me?",
      "I see you there.", "Ready when you are.", "Hello, cursor friend.", "Boop?",
      "Oh, a visitor!", "Hee, hi.", "Looking for a friend?", "Right here!",
    ],
    yawn: [
      "Yaaawn... sorry.", "Excuse me. Big yawn.", "That one was a big one.", "Sleepy eyes activated.",
      "Hnnngh... stretchy.", "Yawn... is it nap time?", "Aah... that felt good.", "Pardon my yawn.",
    ],
    daydream: [
      "I was thinking about snacks.", "Daydreaming about a very big cloud.", "I just imagined a perfect nap.", "Thinking about happy things.",
      "I wonder what's behind that window.", "Just dreaming about the beach.", "What if everything was extra fluffy?", "I had a thought. It's gone now.",
      "Wandering thoughts, return soon.", "I invented a new snack in my head.", "Imagining a very soft blanket.", "Planning my next nap.",
    ],
    walk: [
      "Going for a little stroll!", "Off to explore!", "Just stretching my legs.", "Be right back. Maybe.",
      "Tiny adventure time!", "Pitter patter pitter patter.", "I'm taking the scenic route.", "Look at me go!",
      "Walkies for me!", "Checking out the neighbourhood.",
    ],
    sneeze: ["Achoo!", "Ah... ah... achoo!", "Bless me!", "Whoa. Where did that come from?"],
    hiccup: ["Hic!", "Hic! Excuse me!", "Hic... hic... oh no.", "Hic! It's the snacks."],
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
