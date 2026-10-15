import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import CreateQuizModal from './components/CreateQuizModal';
import TakeQuizModal from './components/TakeQuizModal';

function App() {
  const [showCreate, setShowCreate] = useState(false);
  const [showTake, setShowTake] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState('');

  const handleOpenCreate = () => setShowCreate(true);
  
  const handleOpenTakeDirectly = () => {
    setCurrentQuizId('');
    setShowTake(true);
  };

  const handleStartQuizFromCreatedId = (newQuizId) => {
    setCurrentQuizId(newQuizId);
    setShowTake(true);
  };

  return (
    <div>
      <Navbar 
        onOpenCreate={handleOpenCreate} 
        onOpenTake={handleOpenTakeDirectly} 
      />
      
      <main>
        <Homepage 
          onOpenCreate={handleOpenCreate} 
          onOpenTake={handleOpenTakeDirectly} 
        />
      </main>

      {/* Global Modals */}
      <CreateQuizModal
        show={showCreate}
        onClose={() => setShowCreate(false)}
        onQuizCreatedAndStart={handleStartQuizFromCreatedId}
      />

      <TakeQuizModal
        show={showTake}
        onClose={() => setShowTake(false)}
        quizId={currentQuizId}
      />
    </div>
  );
}

export default App;