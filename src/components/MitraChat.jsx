import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertTriangle, Shield, PhoneCall, Heart, Wind, Sparkles } from 'lucide-react';

// 1. Third-Person Loss / Grief & Bereavement (e.g. friend passed away or took their life)
const GRIEF_REGEX = /(friend|buddy|cousin|brother|sister|roommate|colleague|relative|someone|loved\s+one|partner).*(dead|died|passed\s+away|killed\s+(himself|herself|themselves)|ended\s+(his|her|their)\s+life|committed\s+suicide|took\s+(his|her|their)\s+life)|(sad|upset|crying|broken|hurting|grief|mourning|devastated|lost).*(cause|because|since).*(friend|brother|sister|cousin|someone).*(dead|died|passed|ended|suicide|killed)/i;

// 2. Direct First-Person High Alert Self-Harm (User themselves expresses wanting to die/end their life)
const FIRST_PERSON_CRISIS = /(i\s*(want|wish|need|feel\s*like|plan|going)\s*to\s*(die|kill\s*myself|end\s*my\s*life|commit\s*suicide|hang\s*myself|hurt\s*myself|cut\s*myself|jump|swallow\s*pills))|(i\s*(don'?t\s*want\s*to\s*live|have\s*no\s*reason\s*to\s*live|can'?t\s*take\s*this\s*anymore\s*want\s*to\s*die|better\s*off\s*dead|end\s*it\s*all))|(suicid(al|e)\s*thoughts|want\s*to\s*end\s*everything)/i;

// 3. Curse Words & Aggressive Frustration (English + Hindi/Hinglish)
const PROFANITY_REGEX = /\b(fuck|fucking|shit|bullshit|bitch|bastard|asshole|chutiya|bhenchod|madarchod|bc|mc|saala|kamina|gandu|harami|bhosdike|lund|lauda)\b/i;

export function evaluateMitraIntelligence(text) {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // CASE 1: Third-Person Loss / Friend's death or suicide (Grief, Mourning & Compassionate Psychological Support)
  if (GRIEF_REGEX.test(lower)) {
    return {
      alert: false,
      isGrief: true,
      text: `I am holding so much space for you right now, and I am so deeply, truly sorry for the loss of your friend.\n\nHearing that someone close to you has passed away—especially by ending their own life—is shattering and disorienting. Please know this deep in your heart: what happened was NOT your fault. When someone is in that depth of invisible pain, it can be impossible to foresee, and you loved them with all your heart.\n\nIt is completely natural to feel shock, sudden tears, anger, or even a hollow numbness. All of those feelings are valid, and there is no timeline on grief.\n\nYour friend felt your care, and the most honoring thing you can do for their memory right now is to be gentle with yourself. Your breath, your life, and your warmth matter deeply.\n\nWould you like to tell me what your friend was like, or share a favorite memory you hold of them? I am right here listening with you. 💛`
    };
  }

  // CASE 2: First-Person Direct High Alert for Self-Harm
  if (FIRST_PERSON_CRISIS.test(lower)) {
    return {
      alert: true,
      isGrief: false,
      text: `I hear you, and my heart aches that you are feeling this level of unbearable pain right now. Please stay with me. I know everything feels overwhelmingly heavy, but your life is completely irreplaceable, and your story is not meant to end here.\n\nPain can make our vision narrow and make us feel completely alone, but this storm does pass. You do not have to carry this crushing weight alone for another second.\n\nPlease take a slow, gentle breath. Reach out right now to Tele-MANAS on 14416 (or 112)—it is 100% free, 24/7, confidential, and run by caring counselors ready to hold your hand through this darkness.\n\nAre you in a safe place at this very moment? Please keep talking to me—I care about your safety. 🌿`
    };
  }

  // CASE 3: Curse Words & Raw Venting (De-escalation & Motivational Empathy)
  if (PROFANITY_REGEX.test(lower)) {
    return {
      alert: false,
      isCurse: true,
      text: `I hear how completely furious, frustrated, and exhausted you are right now. Life and circumstances can push us to our absolute boiling point, and feeling raw anger is a completely natural reaction when you feel hurt, betrayed, or unheard.\n\nYou don't have to filter yourself here in our sanctuary. Let's take one big, deep breath together to release some of that tension in your chest.\n\nTell me honestly: what made things feel so completely unfair or infuriating today? Let's untangle it together, step by step.`
    };
  }

  // CASE 4: Anxiety, Panic, Chest Tightness
  if (/anxious|anxiety|panic|worried|worry|nervous|chest|heart racing|scared/.test(lower)) {
    return {
      alert: false,
      text: `That sounds exhausting. When anxiety takes over, our nervous system triggers a fight-or-flight response, causing chest tightness and racing thoughts.\n\nLet's do a quick grounding technique together right now:\n1. Name 3 things you can see around you right now.\n2. Feel your feet resting firmly on the floor.\n3. Take a gentle breath in for 4 seconds, hold for 4, and breathe out for 4.\n\nYou are safe in this moment. What is the worry trying to tell you?`
    };
  }

  // CASE 5: Low, Sad, Lonely, or Empty
  if (/sad|low|lonely|alone|empty|cry|crying|hopeless|heavy/.test(lower)) {
    return {
      alert: false,
      text: `Thank you for sharing that with me. Feeling low or deeply lonely can make the world feel quiet and distant, and you don't have to force yourself to 'snap out of it'.\n\nIt is okay to rest. What has felt like the heaviest part of today? I'm right here with you.`
    };
  }

  // CASE 6: Insomnia & Sleep Problems
  if (/sleep|insomnia|can'?t sleep|awake|tired|exhausted|bedtime/.test(lower)) {
    return {
      alert: false,
      text: `Sleep trouble makes tomorrow feel intimidating before it even begins. When your mind is racing in the dark, try this:\n\n1. Place your phone face down across the room.\n2. Write down the 2 biggest worries on a piece of paper—tell your mind: 'These are written down; I will handle them tomorrow.'\n3. Try the Guided Box Breathing under Restore for 2 minutes.\n\nWould you like to try a calming reflection before closing your eyes?`
    };
  }

  // CASE 7: Exam, Study, Family Expectations & Burnout
  if (/exam|study|college|school|work|job|boss|deadline|pressure|expectations|parents/.test(lower)) {
    return {
      alert: false,
      text: `Pressure from board exams, entrance tests, or family expectations can feel like carrying a mountain on your shoulders. In Indian homes, we often feel the weight of everyone's hopes.\n\nRemember this psychological truth: your worth as a human being is never defined by a score, rank, or job title. You are so much more than what you produce.\n\nLet's break the mountain down into pebbles: what is the one single task that matters right now, and what could safely wait until tomorrow?`
    };
  }

  // CASE 8: Gratitude / Feeling Better
  if (/thank|mitra|helpful|better|good|calm/.test(lower)) {
    return {
      alert: false,
      text: `I am truly glad I could be here for you. Whenever life gets loud or overwhelming, remember that this sanctuary is always open for you. Take gentle care of yourself today 💛.`
    };
  }

  // Default Empathetic Listening
  return {
    alert: false,
    text: `I am here and listening carefully. Tell me a little more about what's going on, and how it is affecting your day.`
  };
}

export default function MitraChat({ chat, onSendMessage, userName }) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, isTyping]);

  const handleSend = (textToSend) => {
    const message = (textToSend || input).trim();
    if (!message) return;

    onSendMessage({
      from: 'user',
      text: message,
      at: Date.now()
    });
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = evaluateMitraIntelligence(message);
      onSendMessage({
        from: 'mitra',
        text: response.text,
        alert: response.alert,
        isGrief: response.isGrief,
        isCurse: response.isCurse,
        at: Date.now()
      });
      setIsTyping(false);
    }, 650);
  };

  const handleQuick = (msg) => {
    handleSend(msg);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: 'var(--navy)' }}>Talk to Mitra</h1>
        <div className="muted" style={{ fontSize: 'clamp(13.5px, 2vw, 15px)', marginTop: '4px' }}>
          A compassionate companion who listens with deep psychological warmth and zero judgment.
        </div>
      </div>

      <div className="chat-window">
        {/* Chat Head */}
        <div className="chat-header">
          <div className="mitra-avatar">म</div>
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: '16px', color: 'var(--navy)' }}>Mitra (मित्र)</b>
            <div className="muted" style={{ fontSize: '12px' }}>
              आपका साथी · Safe sanctuary for real emotions
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#2A9D8F' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2A9D8F' }}></span>
            <span>Always here</span>
          </div>
        </div>

        {/* Messages Body */}
        <div className="chat-messages">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${msg.from === 'user' ? 'user' : 'mitra'} ${msg.alert ? 'alert' : ''}`}
            >
              {/* High Alert Banner for direct self-harm */}
              {msg.alert && (
                <div style={{
                  background: '#FDECEA',
                  borderRadius: '12px',
                  padding: '12px',
                  marginBottom: '12px',
                  border: '1.5px solid #F3C7C1'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
                    <AlertTriangle size={18} />
                    <span>Emergency Crisis Support · Tele-MANAS (14416)</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#7A2A24', lineHeight: 1.5, margin: '0 0 10px' }}>
                    If you are thinking of ending your life, please know you are not alone. Reach out right now to free, toll-free, 24/7 care.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <a
                      href="tel:14416"
                      className="btn btn-danger btn-sm"
                      style={{ textDecoration: 'none', borderRadius: '999px', padding: '6px 14px', fontWeight: 700 }}
                    >
                      <PhoneCall size={14} /> Call Tele-MANAS 14416
                    </a>
                    <a
                      href="tel:112"
                      className="btn btn-ghost btn-sm"
                      style={{ textDecoration: 'none', borderRadius: '999px', padding: '6px 14px', color: 'var(--navy)' }}
                    >
                      Call Emergency 112
                    </a>
                  </div>
                </div>
              )}

              {/* Special Bereavement / Grief Badge */}
              {msg.isGrief && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5B4A8B', fontSize: '12.5px', fontWeight: 600, marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid rgba(142,124,195,0.25)' }}>
                  <Heart size={15} color="#8E7CC3" />
                  <span>Holding space for your grief & bereavement 🕊️</span>
                </div>
              )}

              {/* Curse De-escalation Badge */}
              {msg.isCurse && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D97706', fontSize: '12.5px', fontWeight: 600, marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid rgba(217,119,6,0.2)' }}>
                  <Wind size={15} color="#D97706" />
                  <span>Safe decompression space · Let the frustration out safely</span>
                </div>
              )}

              {msg.text}
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble mitra" style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '12px 18px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8A9BB8', animation: 'pulse 1s infinite' }}></span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8A9BB8', animation: 'pulse 1s infinite 0.2s' }}></span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8A9BB8', animation: 'pulse 1s infinite 0.4s' }}></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Foot & Inputs */}
        <div className="chat-footer">
          <div className="chat-chips">
            <button className="chat-chip" onClick={() => handleQuick('I feel anxious and my chest feels tight')}>
              Feeling anxious
            </button>
            <button className="chat-chip" onClick={() => handleQuick('I feel low and lonely')}>
              Low & lonely
            </button>
            <button className="chat-chip" onClick={() => handleQuick('Exam and family pressure is too heavy')}>
              Family / exam pressure
            </button>
            <button className="chat-chip" onClick={() => handleQuick('I lost someone close to me')}>
              Grief & loss
            </button>
          </div>

          <form
            className="chat-form"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <input
              type="text"
              className="input"
              placeholder="Share whatever is on your mind freely…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn btn-navy"
              style={{ borderRadius: '999px', padding: '0 20px' }}
              disabled={!input.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '12px' }}>
        In immediate danger or crisis? Call <strong>112</strong>, or Tele-MANAS on <strong>14416</strong> (toll-free, 24/7).
      </div>
    </div>
  );
}
