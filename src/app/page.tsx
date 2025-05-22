"use client";

import { useState, useEffect } from 'react';
import CodeModal from './components/CodeModal';
import TOSModal from './components/TOSModal';

type ScriptInfo = {
  title: string;
  description: string;
  filename: string;
};

export default function Home() {
  const [selectedScript, setSelectedScript] = useState<ScriptInfo | null>(null);
  const [scriptContent, setScriptContent] = useState<string>("");
  const [scripts, setScripts] = useState<ScriptInfo[]>([]);
  const [isTOSOpen, setIsTOSOpen] = useState(false);

  useEffect(() => {
    // Check for TOS in URL hash
    if (window.location.hash === '#tos' || window.location.pathname === 'tos') {
      setIsTOSOpen(true);
      // Clean up the URL without refreshing the page
      window.history.replaceState(null, '', '/');
    }

    // Fetch the list of scripts
    fetch('/api/scripts')
      .then(res => res.json())
      .then(data => {
        setScripts(data.scripts);
      })
      .catch(error => {
        console.error('Error fetching scripts:', error);
      });
  }, []);

  const handleScriptClick = async (script: ScriptInfo) => {
    try {
      const response = await fetch(`/scripts/${script.filename}`);
      const content = await response.text();
      console.log('Script content loaded:', { title: script.title, description: script.description }); // Debug log
      setScriptContent(content);
      setSelectedScript(script);
    } catch (error) {
      console.error('Error loading script content:', error);
    }
  };

  return (
    <>
      <div className="main-content">
        <div className="w-full">
          <div className="card card-half profile-section">
            <div className="profile-header">
              <img
                src="https://github.com/rickveltrop.png"
                alt="Profile Picture"
                className="profile-image"
              />
              <div>
                <div className="availability-tag">
                  <div className="availability-dot"></div>
                  Available for work
                </div>
                <div className="name-container">
                  <h1 className="display-name">Froggy</h1>
                  <span className="username">@froggodoggo</span>
                </div>
                <p className="job-title">
                  I'm a <span className="highlight">Roblox Backend Developer</span>
                </p>
                <div className="role-list">
                  <a 
                    href="https://discord.gg/rodevs" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="role-tag rodevs"
                  >
                    Misc Manager in Rodevs
                  </a>
                </div>
              </div>
            </div>

            <div className="skills-container">
              <h2 className="text-gray-400 text-sm mb-3 font-medium">
                Skills & Info
              </h2>
              <div className="flex flex-wrap gap-2">
                <div className="skill-tag programming" data-tooltip="OOP & Bot development">
                  <span className="material-symbols-outlined text-white">
                    code_blocks
                  </span>
                  <span className="text-white">C#</span>
                </div>
                <div className="skill-tag programming" data-tooltip="Game development & Scripting">
                  <span className="material-symbols-outlined text-white">
                    deployed_code
                  </span>
                  <span className="text-white">Lua(u)</span>
                </div>
                <div className="skill-tag programming" data-tooltip="Web development">
                  <span className="material-symbols-outlined text-white">
                    code
                  </span>
                  <span className="text-white">TypeScript</span>
                </div>
                <div className="skill-tag performance" data-tooltip="Performance optimization">
                  <span className="material-symbols-outlined text-white">
                    speed
                  </span>
                  <span className="text-white">Optimization</span>
                </div>
                <div className="skill-tag time" data-tooltip="Central European Time">
                  <span className="material-symbols-outlined text-white">
                    schedule
                  </span>
                  <span className="text-white">UTC+1</span>
                </div>
                <div className="skill-tag language" data-tooltip="Native Dutch, Fluent English">
                  <span className="material-symbols-outlined text-white">
                    translate
                  </span>
                  <span className="text-white">Dutch & English</span>
                </div>
                <div className="skill-tag personal" data-tooltip="29 - 09 - 2004">
                  <span className="material-symbols-outlined text-white">
                    badge
                  </span>
                  <span className="text-white">20yo</span>
                </div>
                <div className="skill-tag location" data-tooltip="Based in Limburg, The Netherlands">
                  <span className="material-symbols-outlined text-white">
                    location_on
                  </span>
                  <span className="text-white">Netherlands</span>
                </div>
                <div className="skill-tag tools" data-tooltip="Version control & collaboration">
                  <span className="material-symbols-outlined text-white">
                    merge
                  </span>
                  <span className="text-white">Git</span>
                </div>
                <div className="skill-tag tools" data-tooltip="CI/CD & Automation">
                  <span className="material-symbols-outlined text-white">
                    terminal
                  </span>
                  <span className="text-white">DevOps</span>
                </div>
              </div>
            </div>

            <div className="buttons-container">
              <a
                href="https://discord.com/users/519508374581149707"
                target="_blank"
                rel="noopener noreferrer"
                className="button primary"
              >
                <i className="ri-discord-fill"></i>
                <span>Hire Me</span>
              </a>
              <a
                href="https://github.com/rickveltrop"
                target="_blank"
                rel="noopener noreferrer"
                className="button secondary"
              >
                <i className="ri-github-fill"></i>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="w-full">
          <div className="card card-half featured-content">
            <div className="featured-game">
              <div className="section-header">
                <span className="material-symbols-outlined icon">
                  sports_esports
                </span>
                <h2 className="section-title">Featured Game</h2>
              </div>
              
              <div className="game-showcase">
                <img 
                  src="/img/gamethumbnail.png" 
                  alt="Featured Game" 
                  className="game-image"
                />
                <div className="game-info">
                  <h3 className="game-title">Plane Game [WIP]</h3>
                  <p className="game-description">
                    Based on the famous AC-130 mission from Call of Duty 4: Modern Warfare.
                  </p>
                  <a 
                    href="https://www.roblox.com/games/133403514523468" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button secondary game-button"
                  >
                    <i className="ri-gamepad-line"></i>
                    <span>Play on Roblox</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="featured-scripts">
              <div className="section-header">
                <span className="material-symbols-outlined icon">
                  code_blocks
                </span>
                <h2 className="section-title">Featured Scripts</h2>
              </div>
              
              <div className="scripts-list">
                {scripts.map((script) => (
                  <div 
                    key={script.title}
                    className="script-item"
                    onClick={() => handleScriptClick(script)}
                  >
                    <span className="material-symbols-outlined script-indicator">preview</span>
                    <div className="script-header">
                      <h3 className="script-title">{script.title}</h3>
                    </div>
                    {script.description && (
                      <p className="script-description text-gray-400 text-sm">{script.description}</p>
                    )}
                  </div>
                ))}
                
                <a
                  href="https://github.com/rickveltrop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="script-item github-card"
                >
                  <span className="material-symbols-outlined script-indicator">launch</span>
                  <div className="script-header">
                    <i className="ri-github-fill text-xl"></i>
                    <h3 className="script-title">More on GitHub</h3>
                  </div>
                  <p className="script-description text-gray-400 text-sm mt-2">
                    Check out my GitHub profile for more projects such as EthnicityService, a C# discord bot tempate, and a C# syntax to lua port!
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full">
          <div className="card card-half process-section">
            <div className="process-content">
              <div className="section-header">
                <span className="material-symbols-outlined icon">
                  cycle
                </span>
                <h2 className="section-title">Working Process</h2>
              </div>
              <p className="section-description">
                Simple and effective collaboration in four steps
              </p>
              
              <div className="process-steps">
                <div className="process-step">
                  <span className="step-number">01</span>
                  <span className="material-symbols-outlined step-icon">
                    handshake
                  </span>
                  <div className="step-content">
                    <h3 className="step-title">Project Discussion</h3>
                    <p className="step-description">
                      We'll go over your requirements, goals, and what you need.
                    </p>
                  </div>
                </div>

                <div className="process-step">
                  <span className="step-number">02</span>
                  <span className="material-symbols-outlined step-icon">
                    developer_mode
                  </span>
                  <div className="step-content">
                    <h3 className="step-title">Development</h3>
                    <p className="step-description">
                      I'll develop your system based on your requirements.
                    </p>
                  </div>
                </div>

                <div className="process-step">
                  <span className="step-number">03</span>
                  <span className="material-symbols-outlined step-icon">
                    lab_research
                  </span>
                  <div className="step-content">
                    <h3 className="step-title">Testing & Revisions</h3>
                    <p className="step-description">
                      Everything will be tested, demonstrated, and potentially revised.
                    </p>
                  </div>
                </div>

                <div className="process-step">
                  <span className="step-number">04</span>
                  <span className="material-symbols-outlined step-icon">
                    rocket_launch
                  </span>
                  <div className="step-content">
                    <h3 className="step-title">Delivery & Setup</h3>
                    <p className="step-description">
                      I'll send you the source code and help with the setup.
                    </p>
                  </div>
                </div>
              </div>

              <button className="tos-button" onClick={() => setIsTOSOpen(true)}>
                <i className="ri-file-text-line"></i>
                <span>Read Terms of Service</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CodeModal
        title={selectedScript?.title || ""}
        description={selectedScript?.description || ""}
        code={scriptContent}
        isOpen={!!selectedScript}
        onClose={() => setSelectedScript(null)}
      />

      <TOSModal 
        isOpen={isTOSOpen}
        onClose={() => setIsTOSOpen(false)}
      />

      <div className="footer-text">
        Made by <span className="accent">@froggodoggo</span>
        <span className="copyright">© 2025 All rights reserved</span>
      </div>
    </>
  );
}
