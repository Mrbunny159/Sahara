import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Send, Sparkles, Shield, User } from 'lucide-react';
import { SyncService } from '../lib/syncService';
import { useAuth } from '../context/AuthContext';

export default function Community({ userName, onShowToast }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCircle, setActiveCircle] = useState('All');
  const [newText, setNewText] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('General');

  // Load real posts from Cloud Firestore
  useEffect(() => {
    let mounted = true;
    const fetchPosts = async () => {
      setLoading(true);
      const cloudPosts = await SyncService.fetchCommunityPosts();
      if (mounted) {
        setPosts(cloudPosts);
        setLoading(false);
      }
    };
    fetchPosts();
    return () => { mounted = false; };
  }, []);

  const handleLike = async (id) => {
    const updated = posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked
        };
      }
      return p;
    });
    setPosts(updated);
    await SyncService.likeCommunityPost(id);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const postPayload = {
      author: userName || 'Sanctuary Friend',
      circle: selectedCircle,
      tag: selectedCircle === 'Students' ? '🎓 Students & Exams' :
           selectedCircle === 'Working Adults' ? '💼 Working Adults' :
           selectedCircle === 'Caregivers' ? '🏡 Caregivers' : '🌱 General Support',
      avatar: '🌿',
      text: newText.trim(),
      likes: 1,
      liked: true,
      time: 'Just now'
    };

    // If registered, sync to Firestore
    if (user && !user.isGuest) {
      const docId = await SyncService.addCommunityPost(user, postPayload);
      if (docId) {
        postPayload.id = docId;
      }
    } else {
      postPayload.id = 'guest_post_' + Date.now();
    }

    setPosts([postPayload, ...posts]);
    setNewText('');
    onShowToast('Supportive message shared with the circle 💛');
  };

  const filteredPosts = activeCircle === 'All'
    ? posts
    : posts.filter(p => p.circle === activeCircle);

  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h1 style={{ fontSize: '32px', color: 'var(--navy)' }}>Support Circles</h1>
        <div className="muted" style={{ fontSize: '15px', marginTop: '4px' }}>
          A safe, empathetic community for shared experiences across every chapter of life.
        </div>
      </div>

      {/* Circle Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
        {['All', 'Students', 'Working Adults', 'Caregivers'].map((c) => (
          <button
            key={c}
            onClick={() => setActiveCircle(c)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: 600,
              border: '1px solid var(--line)',
              background: activeCircle === c ? 'var(--navy)' : '#fff',
              color: activeCircle === c ? '#fff' : 'var(--muted)',
              transition: '0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {c === 'All' ? '🌟 All Circles' :
             c === 'Students' ? '🎓 Students' :
             c === 'Working Adults' ? '💼 Working Adults' : '🏡 Caregivers'}
          </button>
        ))}
      </div>

      <div className="grid g-main" style={{ alignItems: 'start' }}>
        {/* Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
              Loading supportive messages...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
              <Sparkles size={36} color="var(--amber)" style={{ margin: '0 auto 12px', opacity: 0.8 }} />
              <h3 style={{ fontSize: '18px', color: 'var(--navy)', marginBottom: '6px' }}>
                No circle messages yet
              </h3>
              <p style={{ fontSize: '14px', maxWidth: '380px', margin: '0 auto' }}>
                Be the first to share an uplifting thought or a reminder that you are not alone.
              </p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className="card" style={{ padding: '22px' }}>
                <div className="spread" style={{ marginBottom: '12px' }}>
                  <div className="row">
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FFF0E6', display: 'grid', placeItems: 'center', fontSize: '20px' }}>
                      {post.avatar || '🌿'}
                    </div>
                    <div>
                      <b style={{ fontSize: '14.5px', color: 'var(--navy)' }}>{post.author}</b>
                      <div className="muted" style={{ fontSize: '12px' }}>
                        {post.time || (post.date ? new Date(post.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recently')}
                      </div>
                    </div>
                  </div>
                  <span className="tag-badge" style={{ background: '#F0EAF8', color: '#5B4A8B' }}>
                    {post.tag || post.circle}
                  </span>
                </div>

                <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink)', marginBottom: '16px' }}>
                  {post.text}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                  <button
                    onClick={() => handleLike(post.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      color: post.liked ? 'var(--coral)' : 'var(--muted)',
                      fontWeight: 600,
                      transition: '0.2s'
                    }}
                  >
                    <Heart size={16} fill={post.liked ? 'var(--coral)' : 'none'} />
                    <span>{post.likes || 0} Care</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Post Card */}
        <div className="stack">
          <div className="card">
            <h3>Share an Uplifting Word</h3>
            <p className="muted" style={{ fontSize: '13px', marginBottom: '14px' }}>
              Your words might be the exact comfort someone in the family needs today.
            </p>

            <form onSubmit={handleCreatePost}>
              <div className="field">
                <label className="label">Select Circle</label>
                <select
                  className="select"
                  value={selectedCircle}
                  onChange={(e) => setSelectedCircle(e.target.value)}
                >
                  <option value="General">🌱 General Sanctuary</option>
                  <option value="Students">🎓 Students & Exam Prep</option>
                  <option value="Working Adults">💼 Working Adults & Fatigue</option>
                  <option value="Caregivers">🏡 Caregivers & Elders</option>
                </select>
              </div>

              <div className="field">
                <textarea
                  className="textarea"
                  placeholder="Share a thought, a reminder to pause, or a gentle word of hope…"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  style={{ minHeight: '120px' }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <Send size={16} /> Share with Circle
              </button>
            </form>
          </div>

          <div className="card" style={{ background: '#FAF7FD', border: '1px solid #EBE4F4' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#5B4A8B', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
              <Shield size={18} /> Safe & Moderated Space
            </div>
            <p className="muted" style={{ fontSize: '12.5px', lineHeight: 1.55 }}>
              All community messages are reviewed to maintain kindness, privacy, and unconditional mutual respect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
