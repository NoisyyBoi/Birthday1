import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Heart, Sparkles, Gift, Music2, Camera, Moon, Star, ArrowDown, LockKeyhole, Cake, Play, X, Check, RotateCcw, ArrowRight } from "lucide-react";
import "./styles.css";
import FullscreenButton from "./FullscreenButton";

const memories = [
  { date: "OUR BCA DAYS", title: "Before our story began", text: "We knew each other from our BCA days. Back then, we weren't talking all that much. Funny how someone who was already part of your world can later become such a special part of it.", photo: "memory-01.jpg", caption: "Where our paths first crossed ✦" },
  { date: "YOUR BIRTHDAY · LAST YEAR", title: "One little birthday wish", text: "Last year, I wished you happy birthday. I had no idea that one simple message would turn into conversations, hanging out, getting closer, and a story I would never want to rush through.", photo: "memory-02.jpg", caption: "One message. A whole new chapter." },
  { date: "SOMEWHERE ALONG THE WAY", title: "And then, there was us", text: "We started spending more time together. We became close, feelings grew, and somehow we found something beautiful in each other. I may not know the exact date our story became love, but I know how special it feels to be here with you.", photo: "memory-03.jpg", caption: "The best things grew naturally ♡" }
];
const photoFiles = Array.from({ length: 25 }, (_, i) => `memory-${String(i + 1).padStart(2, "0")}.jpg`);

const reasons = [
  "The way you make ordinary moments feel special.",
  "Your smile — yes, this is me being completely biased.",
  "The little things you do that you probably don't even notice.",
  "How being around you can make a hard day feel lighter.",
  "Your laugh. I hope I get to hear it a million more times.",
  "Because I can be myself around you.",
  "And because even this list could never fit all the reasons."
];

const gifts = [
  { title: "A little surprise", label: "MYSTERY GIFT · 01", message: "No hints, no spoilers! Your first surprise is waiting for you in real life. Come receive it from me, then tap the button below when it’s yours. ♡" },
  { title: "Something just for you", label: "MYSTERY GIFT · 02", message: "One more little surprise chosen with you in mind. I’m keeping the secret until you open it in person. Come receive it from me, then mark it received here. ✨" },
  { title: "A box of happiness", label: "MYSTERY GIFT · 03", message: "Surprise number three! The website is keeping its lips sealed 🤐 Come get your gift from me, and tap the button when you’ve received it. ♡" },
  { title: "The final mystery", label: "MYSTERY GIFT · 04", message: "The last wrapped surprise is waiting for you in real life. No spoilers here, birthday girl! Come receive it from me, then mark it received to unlock the final birthday message. 💗" }
];

const quiz = [
  { q: "What's the biggest dream I keep working toward?", options: ["Becoming financially independent and giving my loved ones what they love", "Being famous above everything else", "Travelling alone forever", "Owning the most expensive things"], answer: 0, response: "You remembered the dream behind the hard work. ❤️" },
  { q: "What scares me most when I let someone close to me?", options: ["A little argument", "Being backstabbed by someone I trust", "Someone disagreeing politely", "Being asked for advice"], answer: 1, response: "You know how much trust means to me. ❤️" },
  { q: "Which kind of bike would instantly get my attention?", options: ["Touring scooters", "Classic cruisers", "Motocross bikes", "City commuter bikes"], answer: 2, response: "You know my kind of ride! 🏁" },
  { q: "What caught my attention first about you?", options: ["Your shoes", "Your eyes", "Your phone case", "Your handwriting"], answer: 1, response: "Those eyes got me, Nissuuu. 👀❤️" },
  { q: "When my mind keeps replaying situations again and again, what am I doing?", options: ["Overthinking a lot", "Planning a surprise party every time", "Ignoring everything", "Counting stars"], answer: 0, response: "You know my brain doesn't always take a break. 🫶" },
  { q: "How would I describe my temper and the way I love?", options: ["I never get annoyed and never feel deeply", "I have a short temper but love deeply", "I stay calm in every situation", "I don't care about anyone"], answer: 1, response: "You understand that my temper and my love can coexist. ❤️" },
  { q: "Which behaviour would hurt me more than someone might realise?", options: ["A kind disagreement", "Being ignored or treated disrespectfully", "A surprise hug", "Someone checking in on me"], answer: 1, response: "Respect and attention matter to me. 💗" },
  { q: "When I care about someone, what do I try hardest to do?", options: ["Keep them happy and make them feel cared for", "Avoid talking to them", "Make every decision for them", "Pretend they don't matter"], answer: 0, response: "You see the effort I put into my people. 🫶" },
  { q: "What makes you especially important to me?", options: ["You always agree with me", "You never have your own opinions", "You genuinely understand who I am and how I feel", "You own the same things I do"], answer: 2, response: "Feeling understood by you means more than you know. 💗" },
  { q: "If I want my love to become healthier and stronger, what should I learn to balance?", options: ["Care with trust and healthy boundaries", "Love with ignoring each other", "Feelings with pretending not to care", "Respect with winning every argument"], answer: 0, response: "You know love is strongest when it also leaves room for trust. I love you, Nissuuu. ❤️♾️" },
];

function App() {
  const previewMode = new URLSearchParams(window.location.search).has("birthdayPreview");
  const previewTarget = useRef(Date.now() + 25_000);
  const birthdayTarget = new Date("2026-11-02T00:00:00+05:30").getTime();
  const [now, setNow] = useState(Date.now());
  const birthdaySongRef = useRef(null);
  const [audioNeedsTap, setAudioNeedsTap] = useState(false);
  const [birthdayEntered, setBirthdayEntered] = useState(false);
  const [spokenSecond, setSpokenSecond] = useState(null);
  const [heartOpened, setHeartOpened] = useState(false);
  const [midnightVideoStarted, setMidnightVideoStarted] = useState(false);
  const [midnightVideoFinished, setMidnightVideoFinished] = useState(false);
  const [entered, setEntered] = useState(false);
  const targetTime = previewMode ? previewTarget.current : birthdayTarget;
  const timeLeft = Math.max(0, targetTime - now);
  const birthdayUnlocked = midnightVideoStarted ? midnightVideoFinished : now >= targetTime;
  const remainingSeconds = Math.ceil(timeLeft / 1000);
  const showMidnightVideo = midnightVideoStarted && !midnightVideoFinished;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && timeLeft <= 10_000 && !midnightVideoStarted) {
      setMidnightVideoStarted(true);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    }
  }, [timeLeft, midnightVideoStarted]);

  // Play the birthday song continuously from unlock through the entire website experience.
  // Never pause or restart it when navigating between sections.
  useEffect(() => {
    const song = birthdaySongRef.current;
    if (!song || !birthdayUnlocked) return;
    if (song.paused) {
      song.loop = true;
      const playPromise = song.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(() => setAudioNeedsTap(false)).catch(() => setAudioNeedsTap(true));
      }
    }
  }, [birthdayUnlocked]);

  const startBirthdaySong = () => {
    const song = birthdaySongRef.current;
    if (!song) return;
    song.loop = true;
    song.play().then(() => setAudioNeedsTap(false)).catch(() => setAudioNeedsTap(true));
  };

  useEffect(() => {
    if (timeLeft > 0 && timeLeft <= 10_000 && !showMidnightVideo && !midnightVideoStarted) {
      const second = Math.ceil(timeLeft / 1000);
      if (second !== spokenSecond && second >= 1 && second <= 10) {
        setSpokenSecond(second);
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(String(second));
          utterance.lang = "en-IN";
          utterance.rate = 0.82;
          window.speechSynthesis.speak(utterance);
        }
      }
    }
    if (birthdayUnlocked && !heartOpened) {
      // Keep the birthday reveal visual; omit the spoken name greeting as requested.
      setHeartOpened(true);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    }
  }, [timeLeft, spokenSecond, birthdayUnlocked, heartOpened, showMidnightVideo, midnightVideoStarted]);

  const formatCountdown = (ms) => {
    const total = Math.max(0, Math.floor(ms / 1000));
    return { minutes: Math.floor(total / 60), seconds: total % 60 };
  };
  const countdown = formatCountdown(timeLeft);
  const [activeStep, setActiveStep] = useState(0);
  const [openedStars, setOpenedStars] = useState([]);
  const [receivedGifts, setReceivedGifts] = useState([]);
  const [activeGift, setActiveGift] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const [albumIndex, setAlbumIndex] = useState(0);
  const [albumComplete, setAlbumComplete] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizError, setQuizError] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState("");
  const quizFeedbackTimer = useRef(null);
  const [candlesOut, setCandlesOut] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  const stepComplete = activeStep === 3 ? openedStars.length === reasons.length : activeStep === 4 ? albumComplete : activeStep === 5 ? receivedGifts.length === 4 : activeStep === 6 ? quizDone : activeStep === 7 ? candlesOut : true;
  const nextStep = () => { if (!stepComplete) return; if (activeStep < 7) setActiveStep((step) => step + 1); else setShowLetter(true); };
  const previousStep = () => { if (activeStep > 0) setActiveStep((step) => step - 1); };
  const answerQuiz = (index) => {
    // Keep each answer message visible briefly before clearing or advancing.
    if (quizFeedback) return;
    if (quizFeedbackTimer.current) window.clearTimeout(quizFeedbackTimer.current);
    if (index !== quiz[quizIndex].answer) {
      setQuizError(true);
      quizFeedbackTimer.current = window.setTimeout(() => {
        setQuizError(false);
        quizFeedbackTimer.current = null;
      }, 8000);
      return;
    }
    setQuizError(false);
    setAnswers((prev) => [...prev, index]);
    setQuizFeedback(`You're right, Nissuuu! ❤️ ${quiz[quizIndex].response}`);
    quizFeedbackTimer.current = window.setTimeout(() => {
      setQuizFeedback("");
      quizFeedbackTimer.current = null;
      if (quizIndex === quiz.length - 1) setQuizDone(true);
      else setQuizIndex((prev) => prev + 1);
    }, 8000);
  };

  useEffect(() => () => {
    if (quizFeedbackTimer.current) window.clearTimeout(quizFeedbackTimer.current);
  }, []);

  return (
    <main>
      <audio ref={birthdaySongRef} src="/nisarga-birthday-song.m4a" loop preload="auto" />
      {audioNeedsTap && <button className="song-tap-button song-tap-persistent" onClick={startBirthdaySong} aria-label="Tap to play birthday song">♪ Tap to play your birthday song</button>}
      {!birthdayEntered && !entered && (
        <div className={`birthday-gate ${birthdayUnlocked ? "birthday-gate-open" : ""}`}>
          {showMidnightVideo && <video className="midnight-countdown-video" src="/midnight-countdown-video.mp4" autoPlay muted={false} playsInline preload="auto" onEnded={() => setMidnightVideoFinished(true)} aria-label="Birthday countdown video" />}
          <div className="gate-stars" aria-hidden="true">{Array.from({length: 42}, (_, i) => <i key={i} style={{left:`${(i*41)%100}%`,top:`${(i*67)%100}%`,animationDelay:`${(i%8)*.35}s`}} />)}</div>
          {birthdayUnlocked && <div className="birthday-celebration" aria-hidden="true">
            {Array.from({ length: 110 }, (_, i) => <i key={i} className={`party-piece party-piece-${i % 6}`} style={{ left: `${(i * 37 + 11) % 100}%`, animationDelay: `${-((i * 17) % 90) / 10}s`, animationDuration: `${5.5 + ((i * 13) % 55) / 10}s`, '--drift': `${((i * 29) % 160) - 80}px`, '--spin': `${360 + ((i * 23) % 720)}deg` }} />)}
            {Array.from({ length: 36 }, (_, i) => <b key={`glitter-${i}`} className="party-glitter" style={{ left: `${(i * 53 + 7) % 100}%`, top: `${(i * 31 + 13) % 100}%`, animationDelay: `${(i % 9) * .23}s` }}>✦</b>)}
          </div>}
          {!birthdayUnlocked && !showMidnightVideo ? <div className="gate-content">
            <p className="gate-eyebrow">A LITTLE MIDNIGHT SURPRISE</p>
            <h1 className="gate-main-title">Turning <span className="age-highlight">22</span> in...</h1>
            <p className="gate-subtitle">A little more waiting, a whole lot of love. ❤️</p>
            <div className="countdown-grid" aria-label="Time left until the surprise">
              {[{value:String(countdown.minutes).padStart(2,"0"),label:"MINUTES"},{value:String(countdown.seconds).padStart(2,"0"),label:"SECONDS"}].map((unit) => <div className="countdown-unit" key={unit.label}><strong>{unit.value}</strong><span>{unit.label}</span></div>)}
            </div>
            <div className="gate-teddy" aria-hidden="true"><span className="teddy-glow"></span><span className="teddy-emoji">🧸</span><span className="teddy-heart">❤️</span></div>
            <p className="gate-whisper">Something very special is waiting for you</p>
          </div> : birthdayUnlocked ? <div className="gate-content birthday-content">
            <p className="gate-eyebrow">IT'S YOUR MOMENT</p>
            <div className={`heart-opening ${heartOpened ? "heart-opening-active" : ""}`}><span className="teddy-emoji">🧸</span><span className="heart-lid">💖</span><span className="heart-letter">💌</span></div>
            <h2 className="birthday-main-title">Happy Birthday,<br/><span>Nisarga</span></h2>
            <p className="birthday-subtitle">Made with all my love, just for you.</p>
            {audioNeedsTap && <button className="song-tap-button" onClick={startBirthdaySong}>♪ Tap to play your birthday song</button>}
            <button className="primary-button gate-enter" onClick={() => {setBirthdayEntered(true); setEntered(true); setActiveStep(0);}}>Enter your little universe <Sparkles size={16}/></button>
          </div> : null}
          {!showMidnightVideo && <span className="gate-footnote">MADE WITH LOVE · JUST FOR YOU</span>}
        </div>
      )}

      {birthdayEntered && !entered && (
        <div className="intro">
          <div className="intro-stars" aria-hidden="true">{Array.from({length: 48}, (_, i) => <i key={i} style={{left: `${(i*37)%100}%`, top: `${(i*61)%100}%`, animationDelay: `${(i%7)*.4}s`, opacity: .25 + (i%5)*.13}} />)}</div>
          <div className="moon-glow"><Moon size={32} strokeWidth={1.1} /></div>
          <div className="intro-content">
            <p className="eyebrow"><Sparkles size={13} /> A LITTLE UNIVERSE, JUST FOR YOU</p>
            <p className="intro-pre">For the girl who makes my world brighter</p>
            <h1>Nisarga<span className="pink">.</span></h1>
            <p className="nickname">my Nissuuu ♡</p>
            <p className="intro-copy">It started with one little birthday wish.<br/>I didn't know it would lead me to something this special.</p>
            <button className="primary-button" onClick={() => {setEntered(true); setActiveStep(0);}}>
              Enter my universe <Sparkles size={16} />
            </button>
            <span className="tiny-note">MADE WITH LOVE · JUST FOR YOU</span>
          </div>
          <div className="intro-bottom">A LITTLE JOURNEY, ONE MOMENT AT A TIME</div>
        </div>
      )}

      <section className={`hero section journey-step ${activeStep === 0 ? "active-step" : ""}`} id="home">
        <div className="hero-orb orb-one"></div><div className="hero-orb orb-two"></div>
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line"></span> NOVEMBER 02 · YOUR DAY</p>
          <h2>In a universe<br/>full of stars, <em>it's you.</em></h2>
          <p className="hero-text">Last year, a birthday wish started a conversation. Since then, you've become one of my favourite parts of life. This little universe is for the story that grew from that one message.</p>
        </div>
        <div className="hero-art" aria-label="Teddy bear holding a heart with the number 22">
          <img className="hero-teddy-image" src="/teddy-22-hero.png" alt="A teddy bear holding a red heart beneath a glowing 22" />
          <Star className="float-star star-a" size={22} fill="currentColor"/><Star className="float-star star-b" size={13} fill="currentColor"/><Star className="float-star star-c" size={17} fill="currentColor"/>
        </div>
        <div className="scroll-cue"><span></span> ONE SCREEN AT A TIME</div>
      </section>

      <section className={`section video-section journey-step ${activeStep === 1 ? "active-step" : ""}`} id="our-video">
        <div className="section-heading centered"><p className="eyebrow"><Heart size={13}/> A MOMENT ON REPEAT</p><h2>Some moments deserve<br/><em>to last a little longer.</em></h2><p>A little memory of us, playing on repeat — just like the way I replay my favourite moments with you.</p></div>
        <div className="video-frame"><video src="/our-video.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="A memory of us" /><span className="video-caption">OUR LITTLE MOMENT ♡</span></div>
      </section>

      <section className={`section story-section journey-step ${activeStep === 2 ? "active-step" : ""}`} id="story">
        <div className="section-heading">
          <p className="eyebrow"><Sparkles size={13}/> CHAPTER ONE</p>
          <h2>Little moments,<br/><em>big feelings.</em></h2>
          <p>I can't choose just one favourite memory with you. Every little moment has become something I want to keep. So here's a little piece of how we became us.</p>
        </div>
        <div className="timeline">
          {memories.map((m, i) => <article className={`timeline-item ${i%2 ? "reverse" : ""}`} key={m.title}>
            <div className="timeline-dot"><Heart size={13} fill="currentColor"/></div>
            <div className="timeline-card">
              <div className={`memory-photo photo-${i+1}`} onClick={() => setActivePhoto(m)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setActivePhoto(m)}>
                <img src={`/photos/${m.photo}`} alt={m.caption} loading="lazy"/><span className="photo-tape"></span>
              </div>
              <div className="timeline-copy"><span className="date-label">{m.date}</span><h3>{m.title}</h3><p>{m.text}</p><button className="mini-link" onClick={() => setActivePhoto(m)}>Open this memory ↗</button></div>
            </div>
          </article>)}
        </div>
        <p className="edit-hint">✦ Every photo here is one of our little pieces of forever. ♡</p>
      </section>

      <section className={`section stars-section journey-step ${activeStep === 3 ? "active-step" : ""}`} id="stars">
        <div className="stars-backdrop"></div>
        <div className="section-heading centered">
          <p className="eyebrow"><Star size={13}/> A SKY FULL OF LITTLE THINGS</p>
          <h2>Reasons I love <em>you.</em></h2>
          <p>Tap a star, Nissuuu. Each one is hiding a little truth.</p>
        </div>
        <div className="star-field">
          {reasons.map((reason, i) => <button key={reason} className={`reason-star rs-${i+1} ${openedStars.includes(i) ? "revealed" : ""}`} onClick={() => setOpenedStars(prev => prev.includes(i) ? prev : [...prev, i])} aria-label={`Reveal reason ${i+1}`}>
            <Star size={openedStars.includes(i) ? 25 : 21} fill="currentColor"/><span>{openedStars.includes(i) ? reason : `0${i+1}`}</span>
          </button>)}
          <div className="star-center"><Heart size={23} fill="currentColor"/><span>for you</span></div>
        </div>
        <p className="star-progress">{openedStars.length} OF {reasons.length} LITTLE REASONS DISCOVERED</p>
      </section>

      <section className={`section scrapbook-section journey-step ${activeStep === 4 ? "active-step" : ""}`} id="scrapbook">
        <div className="section-heading">
          <p className="eyebrow"><Camera size={13}/> THE LITTLE SCRAPBOOK</p>
          <h2>Moments I wish<br/>I could <em>keep forever.</em></h2>
          <p>Photos fade into the camera roll. The feelings behind them never have to.</p>
        </div>
        {!albumComplete ? <div className="album-viewer">
          <div className="album-single-card" key={photoFiles.slice(3)[albumIndex]}>
            <div className="album-single-image"><img src={`/photos/${photoFiles.slice(3)[albumIndex]}`} alt={`Our memory ${albumIndex + 1}`} /></div>
            <div className="album-single-caption"><span>MEMORY {String(albumIndex + 1).padStart(2, "0")} / {photoFiles.length - 3}</span><p>{["a little chaos ♡", "my happy place", "just us", "more days like this"][albumIndex % 4]}</p></div>
          </div>
          <div className="album-viewer-controls">
            <span>{albumIndex + 1} of {photoFiles.length - 3} memories</span>
            <button className="primary-button" onClick={() => { if (albumIndex < photoFiles.length - 4) setAlbumIndex(index => index + 1); else setAlbumComplete(true); }}>
              {albumIndex < photoFiles.length - 4 ? "Next memory ✦" : "Reveal our full album ♡"}
            </button>
          </div>
        </div> : <>
          <p className="album-complete-note"><Heart size={13} fill="currentColor"/> You’ve seen every memory. Here’s our little album, all together.</p>
          <div className="scrapbook-grid">
            {photoFiles.slice(3).map((photo, i) => <button className={`scrap-card scrap-${(i%4)+1}`} key={photo} onClick={() => setActivePhoto({title: ["A little chaos", "My happy place", "Just us", "More days like this"][i%4], date: "A MEMORY TO KEEP", text: "Every photo holds a little moment I want to keep with you. ♡", photo, caption: "A little piece of us"})}>
              <div className="scrap-image"><img src={`/photos/${photo}`} alt={`Memory ${i+4}`} loading="lazy"/></div><span className="scrap-caption">{["a little chaos ♡", "my happy place", "just us", "more days like this"][i%4]}</span>
            </button>)}
          </div>
        </>}
      </section>

      <section className={`section gifts-section journey-step ${activeStep === 5 ? "active-step" : ""}`} id="gifts">
        {(() => {
          const currentIdx = receivedGifts.length;
          const allReceived = currentIdx === gifts.length;
          return (
            <div className="fg-scene">
              <div className="fg-particles" aria-hidden="true">
                {Array.from({length: 18}, (_, i) => (
                  <span key={i} className={`fg-particle fg-p${(i % 6) + 1}`}
                    style={{left:`${(i*53+7)%100}%`, animationDelay:`${(i*0.37).toFixed(2)}s`}} />
                ))}
              </div>
              <div className="fg-header">
                <p className="eyebrow"><Sparkles size={12}/> A LITTLE SURPRISE FOR YOU</p>
                {allReceived && <h2 className="fg-title"><em>All gifts</em> received</h2>}
              </div>


              <div className="fg-dots" aria-label={`${currentIdx} of 4 gifts received`}>
                {gifts.map((_, i) => (
                  <span key={i} className={`fg-dot ${i < currentIdx ? "fg-dot--done" : i === currentIdx ? "fg-dot--current" : "fg-dot--locked"}`} />
                ))}
              </div>
              {!allReceived ? (
                <button
                  className="fg-box"
                  onClick={() => setActiveGift(currentIdx)}
                  aria-label={`Open gift ${currentIdx + 1}`}
                >
                  <span className="fg-glow" aria-hidden="true" />
                  <span className="fg-body" aria-hidden="true">
                    <span className="fg-lid">
                      <span className="fg-ribbon-h" />
                      <span className="fg-bow">
                        <span className="fg-bow-l" />
                        <span className="fg-bow-r" />
                        <span className="fg-bow-knot" />
                      </span>
                    </span>
                    <span className="fg-base">
                      <span className="fg-number-badge" aria-hidden="true">{currentIdx + 1}</span>
                    </span>
                  </span>
                  <span className="fg-label" aria-hidden="true">
                    <span className="fg-label-num">{gifts[currentIdx].label}</span>
                    <span className="fg-label-title">{gifts[currentIdx].title}</span>
                    <span className="fg-label-cta">TAP TO UNWRAP</span>
                  </span>
                </button>
              ) : (
                <div className="fg-done">
                  <span className="fg-done-icon"><Heart size={38} fill="currentColor"/></span>
                  <h3>Nissuuu, the surprise is not over yet!</h3>
                  <p>You have received all four gifts, but my favourite part is still making memories with you. Happy birthday, my love.</p>
                </div>
              )}
              {!allReceived && (
                <p className="fg-hint">Come receive it in person, then tap to confirm</p>
              )}
            </div>
          );
        })()}
      </section>

      <section className={`section quiz-section journey-step ${activeStep === 6 ? "active-step" : ""}`} id="quiz">
        <div className="quiz-card">
          <div className="quiz-icon"><Sparkles size={24}/></div>
          <p className="eyebrow">A VERY IMPORTANT LITTLE QUIZ</p>
          <h2>How well do you<br/><em>know us?</em></h2>
          {!quizDone ? <>
            <div className="quiz-progress"><span style={{width: `${(quizIndex/quiz.length)*100}%`}}></span></div>
            <p className="quiz-count">ROUND {quizIndex < 5 ? "I" : "II"} · QUESTION {quizIndex+1} OF {quiz.length}</p>
            <h3>{quiz[quizIndex].q}</h3>
            <div className="quiz-options">{quiz[quizIndex].options.map((option, i) => <button key={option} onClick={() => answerQuiz(i)} disabled={Boolean(quizFeedback)}>{option}<span>↗</span></button>)}</div>
            {quizError && <p className="quiz-error" role="alert" aria-live="polite">Oops, you're wrong, Nissuuu! 🤭 Try again, babyyy! ❤️</p>}
            {quizFeedback && <p className="quiz-success" role="status" aria-live="polite"><Check size={17} aria-hidden="true"/> {quizFeedback}</p>}
          </> : <div className="quiz-result"><div className="result-heart"><Heart size={25} fill="currentColor"/></div><h3>You passed with flying colours.</h3><p>{quiz[quiz.length-1].response}</p><button className="text-button" onClick={() => {setQuizIndex(0);setQuizDone(false);setAnswers([]);setQuizError(false);setQuizFeedback("");}}>Play again <RotateCcw size={14}/></button></div>}
        </div>
      </section>

      <section className={`section finale-section journey-step ${activeStep === 7 ? "active-step" : ""}`} id="finale">
        <div className="finale-stars"></div>
        <p className="eyebrow"><Cake size={14}/> THE BIG LITTLE MOMENT</p>
        <h2>Make a wish,<br/><em>birthday girl.</em></h2>
        <p className="finale-copy">Close your eyes for a second. Think of something beautiful. Then tap the cake when you're ready.</p>
        <button className={`cake-button ${candlesOut ? "blown" : ""}`} onClick={() => setCandlesOut(true)} aria-label="Blow out the birthday candles">
          <div className="cake-candles">{[0,1,2].map(i => <span key={i} className={`candle candle-${i+1}`}>{!candlesOut && <i className="flame"></i>}</span>)}</div>
          <div className="cake-top"></div><div className="cake-layer layer-top"></div><div className="cake-layer layer-bottom"></div><div className="cake-plate"></div>
        </button>
        <p className="cake-instruction">{candlesOut ? "WISH MADE ✦ NOW LET ME TELL YOU SOMETHING..." : "TAP THE CAKE TO MAKE A WISH"}</p>
        {candlesOut && <div className="birthday-reveal"><Sparkles size={22}/><h3>Happy birthday, my Nissuuu.</h3><p>One birthday wish brought us closer, and I'm so grateful it did. Out of all the stars in this universe, I'm glad I got to know you, grow closer to you, and share this story with you. Happy birthday, Nissuuu. Here's to all the moments we haven't made yet. ♡</p></div>}
        <div className="media-card">
          <div className="media-icon"><Music2 size={21}/></div><div className="media-copy"><strong>A little message from me to you</strong><span>A voice note, a video, or just a few words from my heart.</span></div>
          <button className="play-button" onClick={() => setShowMedia(true)} aria-label="Open voice or video message"><Play size={17} fill="currentColor"/></button>
        </div>
        <p className="signoff">made with all my love <Heart size={12} fill="currentColor"/> for Nissuuu</p>
      </section>

      {entered && <nav className="journey-arrows" aria-label="Page navigation">
        <button className="journey-arrow journey-back" onClick={previousStep} disabled={activeStep === 0} aria-label="Go back" title="Go back"><ArrowRight size={22}/></button>
        <button className={`journey-arrow journey-forward ${stepComplete ? "is-ready" : "is-locked"}`} onClick={nextStep} disabled={!stepComplete} aria-label={activeStep === 7 ? "Open birthday letter" : "Go to next page"} title={!stepComplete ? "Finish this activity to continue" : activeStep === 7 ? "Open birthday letter" : "Next page"}><ArrowRight size={22}/></button>
      </nav>}

      {activeGift !== null && <div className="modal-backdrop" onClick={() => setActiveGift(null)}><div className="modal gift-modal" onClick={e => e.stopPropagation()}><button className="close-modal" onClick={() => setActiveGift(null)} aria-label="Close"><X size={19}/></button><div className="modal-sparkle"><Gift size={25}/></div><p className="eyebrow">{gifts[activeGift].label}</p><h2>{gifts[activeGift].title}</h2><p>{receivedGifts.includes(activeGift) ? "You’ve marked this gift as received. Now come give me a smile. ♡" : "Your gift is waiting for you in real life. Come and receive it from me, then tap the button below when it’s yours. ♡"}</p><p className="gift-note">{gifts[activeGift].message}</p>{!receivedGifts.includes(activeGift) ? <button className="primary-button" onClick={() => {setReceivedGifts(prev => [...prev, activeGift]);setActiveGift(null);}}>I’ve received my gift! <Check size={15}/></button> : <button className="primary-button" onClick={() => setActiveGift(null)}>Keep this close <Heart size={15}/></button>}</div></div>}
      {activePhoto && <div className="modal-backdrop" onClick={() => setActivePhoto(null)}><div className="modal photo-modal" onClick={e => e.stopPropagation()}><button className="close-modal" onClick={() => setActivePhoto(null)} aria-label="Close"><X size={19}/></button><div className="photo-modal-art"><img src={`/photos/${activePhoto.photo}`} alt={activePhoto.caption || activePhoto.title}/></div><p className="eyebrow">{activePhoto.date}</p><h2>{activePhoto.title}</h2><p>{activePhoto.text}</p><button className="primary-button" onClick={() => setActivePhoto(null)}>A memory to keep <Heart size={15}/></button></div></div>}
      {showLetter && <div className="modal-backdrop letter-backdrop" onClick={() => setShowLetter(false)}><div className="modal letter-modal full-letter-modal" onClick={e => e.stopPropagation()}><button className="close-modal" onClick={() => setShowLetter(false)} aria-label="Close"><X size={19}/></button><article className="letter-paper full-letter-paper">
        <h2>💌 To My Nissuuu… My Favourite Girl ❤️🧸</h2>
        <p>Happy Birthday, Nissuuuuu! 🎂🎀💗</p>
        <p>Babyyyy, first of all, <strong>HAPPY BIRTHDAYYYYY!</strong> 🥹❤️🎉</p>
        <p>I wish I could explain what you mean to me in a way that would let you see yourself through my eyes 👀💗. Maybe then you’d understand why even the smallest moments with you mean so much to me 🫶🏻✨.</p>
        <p>Sometimes, I think about how funny our story actually is 🥹💭. Back then, we weren’t talking that much 😂. We had no idea that one day, you’d become <em>my person</em> 🫂❤️ — someone I’d want to tell everything to, someone I’d want beside me, someone whose smile could make an ordinary day feel special 🌷☀️.</p>
        <p>And then came your birthday last year 🎂💌. I wished you, just like a normal birthday wish… but look at us now, Nissuuu 🥹❤️. Who knew that something so small would become the beginning of something so important to me? 🦋💫</p>
        <p>One little wish turned into conversations 💬💕. Those conversations turned into spending time together 👫🏻💗. And somewhere between all those moments, you became someone I started caring about in a way I can’t properly put into words 🥹💘.</p>
        <p>I honestly can’t point to one particular day and say, “That’s when you became special to me.” Because it wasn’t just one day 🌸. It was everything that happened after — every conversation, every laugh 😂❤️, every time we spent together 🫶🏻, every picture 📸, every little memory that probably looked ordinary at the time but became something I’d want to look back on forever ♾️💗.</p>
        <p><strong>Nissuuu, if there’s one thing I want you to understand, it’s that I don’t need a special occasion to feel lucky to have you.</strong> 🥹🧿 Even the most normal day becomes a little more beautiful when you’re part of it 🌈❤️.</p>
        <p>I love our pictures together 📸💞 because they remind me of moments I got to share with you. But honestly, the best part isn’t how we look in those pictures 🥰. It’s knowing that I was there with you when that memory happened 🫂💗. And if I could keep one thing forever, it wouldn’t just be the pictures — it would be the feeling of being with you in those moments 🌙✨❤️.</p>
        <p>You know what I wish for us? 🥹💭 More memories ♾️💕. So many more that we eventually forget which one to talk about first 😂📸. More random plans 🚗💨, more laughs over stupid things 🤭, more pictures that we’ll keep looking at 📷💗, more moments where we’re just being ourselves 🫶🏻. I want us to have those memories that make us smile years later and say, “Do you remember this?” 🥹❤️.</p>
        <p>And baby, I know I’m not perfect 🥺❤️. I might annoy you, tease you, act silly 🤪, or sometimes fail to explain what’s going on in my head 💭. But what I feel for you is something I genuinely cherish 💗🫂. I want to keep knowing you — not just the happy, smiling version of you 😊🌷, but every version of you 🥹❤️. I want to celebrate your wins 🏆🎉, encourage you when things get difficult 🤍, listen when you need someone 🫂, and remind you how capable and special you are 👑💖.</p>
        <p>Today is your birthday, so I hope you let yourself feel how loved you are 🎂💝. I hope this year brings you closer to everything you dream about 🌠✨. I hope you smile more 😊, worry less 🫶🏻, achieve the things you work hard for 🏆, and find happiness even in the smallest things 🌻☀️. And whenever you need someone in your corner, I hope you know that I want to be that person for you 🫂❤️.</p>
        <p>I made this little website and these surprises because I didn't want to just send you a birthday message and call it a day 💻💌. I wanted to make something that feels like <em>us</em> 🥹💗. Something you could click through, smile at 😊, remember our moments through 📸, and maybe come back to whenever you feel like it 🌙✨.</p>
        <p>The photos are little pieces of our story 📸💞. The stars are seven tiny reminders of the things I adore about you ⭐💗. And the gifts… hehe, you’ll have to discover those one by one 🤭🎁. No cheating, birthday girl! 😂💋❤️</p>
        <p>But even after all of that, there’s one thing I still want to tell you 🥹💌.</p>
        <p><strong>Out of all the unexpected things that happened after that birthday wish last year, getting closer to you is one of the things I’m most grateful for.</strong> 🫶🏻❤️✨</p>
        <p>I didn’t know that wishing you on your birthday would lead to this 🎂💗. I didn’t know that the girl I knew from college would become someone who means this much to me 🎓🥹. And I definitely didn’t know that I’d be sitting here making a whole birthday website just to see you smile 😂💻💝.</p>
        <p>But here I am, and I wouldn’t want to change the way our story began 🌷💫❤️.</p>
        <p>Happy Birthday, my Nissuuu 🎂🎀💗. My favourite girl 🧸❤️. My little happiness ☀️🥹. My favourite notification 📱💌. My cutest headache 🤭😂💕.</p>
        <p>I hope today makes you feel as special as you make my life feel 🌎❤️. And I hope this is just one of many birthdays where I get to remind you how much you mean to me 🎂🫂♾️.</p>
        <p><strong>One birthday wish started our story 💌. Now, I want to keep making memories with you, one little moment at a time.</strong> 🌙📸💗</p>
        <p>I love you, Nissuuu 🥹❤️ — more than this letter can explain, and definitely more than I can fit into this little website 💻💌🌷.</p>
        <p className="letter-sign">Forever your annoying person 🤭💋,<br/><strong>Kushal ❤️🧸</strong></p>
        <p><em>P.S. — Nissuuu, if you’re smiling right now, mission accomplished 😚💗. But don’t get too comfortable… you still have all four gifts to discover 🎁🎁🎁🎁🤭. And no, the surprise isn’t over until you’ve received every single one! Hehehe 😂❤️🎀</em></p>
        <p><strong>Once again, HAPPY BIRTHDAY, MY BABYYYY!</strong> 🎂🎉💋❤️♾️</p>
      </article></div></div>}
      {showMedia && <div className="modal-backdrop" onClick={() => setShowMedia(false)}><div className="modal media-modal" onClick={e => e.stopPropagation()}><button className="close-modal" onClick={() => setShowMedia(false)} aria-label="Close"><X size={19}/></button><div className="modal-sparkle"><Music2 size={25}/></div><p className="eyebrow">A MESSAGE FROM YOUR PERSON</p><h2>Press play, Nissuuu.</h2><p>A little message, saved just for you. Put on your headphones and listen whenever you need a smile. ♡</p><div className="audio-player"><Music2 size={20}/><audio controls preload="metadata" src="/voice-note.mp3">Your browser does not support audio playback.</audio></div><p className="small-muted">A little voice note, just for you. ♡</p><button className="primary-button" onClick={() => setShowMedia(false)}>Keep this close <Heart size={15}/></button></div></div>}

      {/* Full-screen toggle — always visible, never covers modals (z-index: 19) */}
      <FullscreenButton />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
