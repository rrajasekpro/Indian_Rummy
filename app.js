// This file is the single-file React Native/Expo application.
// It converts the existing component logic to use mobile-friendly components (View, Text, etc.)
// and uses 'tailwind-rn' for styling to maintain a consistent look.

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useTailwind } from 'tailwind-rn';

// Dummy icons since we cannot use 'lucide-react' directly in plain React Native
// In a real Expo project, you would use '@expo/vector-icons'
const Icon = ({ name, style }) => <Text style={style}>{name}</Text>;
const Plus = (props) => <Icon name="+" style={props.style} />;
const Minus = (props) => <Icon name="-" style={props.style} />;
const Trophy = (props) => <Icon name="🏆" style={props.style} />;
const RotateCcw = (props) => <Icon name="🔄" style={props.style} />;
const Settings = (props) => <Icon name="⚙️" style={props.style} />;
const Trash2 = (props) => <Icon name="🗑️" style={props.style} />;

// Core Application Component
export default function App() {
  const tailwind = useTailwind();
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [roundScores, setRoundScores] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [totalRounds, setTotalRounds] = useState(7);
  const [showSettings, setShowSettings] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(6);

  const addPlayer = () => {
    if (newPlayerName.trim() && !gameStarted && players.length < maxPlayers) {
      // Use a robust ID generation
      const newPlayer = { id: Date.now().toString(), name: newPlayerName.trim(), total: 0 };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id) => {
    if (!gameStarted) {
      setPlayers(players.filter(p => p.id !== id));
    }
  };

  const startGame = () => {
    if (players.length >= 2) {
      setGameStarted(true);
    }
  };

  const updateRoundScore = (playerId, score) => {
    // Ensure score is a number or empty string
    const value = score.replace(/[^0-9]/g, '');
    setRoundScores({
      ...roundScores,
      [`${currentRound}-${playerId}`]: value
    });
  };

  const completeRound = () => {
    const enteredScores = players.map(player => ({
      id: player.id,
      score: parseInt(roundScores[`${currentRound}-${player.id}`] || 0)
    }));

    // 1. Check for one and only one winner (score 0)
    const zeroScores = enteredScores.filter(item => item.score === 0);
    if (zeroScores.length !== 1) {
      Alert.alert(
        'Error',
        'One and only one player must have a score of 0 (the round winner). Please correct the scores.'
      );
      return;
    }

    // 2. Check all scores are entered (and non-negative, handled by parseInt >= 0)
    const allScoresEntered = players.every(player => {
        const score = roundScores[`${currentRound}-${player.id}`];
        return score !== undefined && score !== '';
    });

    if (!allScoresEntered) {
        Alert.alert('Error', 'Please enter scores for all players.');
        return;
    }


    // 3. Update totals
    const updatedPlayers = players.map(player => {
      const roundScore = enteredScores.find(item => item.id === player.id)?.score || 0;
      const newTotal = player.total + roundScore;
      return { ...player, total: newTotal };
    });

    setPlayers(updatedPlayers);

    if (currentRound >= totalRounds) {
      setGameEnded(true);
    } else {
      setCurrentRound(currentRound + 1);
    }
  };

  const resetGame = () => {
    setPlayers([]);
    setNewPlayerName('');
    setCurrentRound(1);
    setRoundScores({});
    setGameStarted(false);
    setGameEnded(false);
  };

  const newGame = () => {
    setPlayers(players.map(p => ({ ...p, total: 0 })));
    setCurrentRound(1);
    setRoundScores({});
    setGameStarted(true);
    setGameEnded(false);
  };

  // --- Game Over Screen ---
  if (gameEnded) {
    const sortedPlayers = [...players].sort((a, b) => a.total - b.total);
    const winner = sortedPlayers[0];

    return (
      <View style={tailwind('flex-1 bg-green-700 p-4 justify-center items-center')}>
        <View style={tailwind('bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full')}>
          <Text style={tailwind('text-6xl text-center text-yellow-500 mb-4')}>{Trophy().props.name}</Text>
          <Text style={tailwind('text-4xl font-bold text-gray-800 mb-4 text-center')}>Game Over!</Text>
          <Text style={tailwind('text-2xl text-gray-700 mb-2 text-center')}>{winner.name} Wins!</Text>
          <Text style={tailwind('text-lg text-gray-600 mb-6 text-center')}>Lowest Score: {winner.total} points</Text>

          <View style={tailwind('space-y-4 mb-6')}>
            <Text style={tailwind('text-xl font-semibold text-gray-800 mb-2 text-center')}>Final Standings</Text>
            {sortedPlayers.map((player, idx) => (
              <View key={player.id} style={tailwind('flex flex-row justify-between items-center bg-gray-50 p-3 rounded-lg')}>
                <View style={tailwind('flex flex-row items-center')}>
                  <Text style={tailwind('font-bold text-gray-500 mr-3')}>#{idx + 1}</Text>
                  <Text style={tailwind('font-medium')}>{player.name}</Text>
                </View>
                <Text style={tailwind('font-bold text-gray-700')}>{player.total}</Text>
              </View>
            ))}
          </View>

          <View style={tailwind('flex flex-row gap-3 mt-6')}>
            <TouchableOpacity
              onPress={newGame}
              style={tailwind('flex-1 bg-green-600 py-3 rounded-lg')}
            >
              <Text style={tailwind('text-white font-semibold text-center')}>New Game</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={resetGame}
              style={tailwind('flex-1 bg-gray-600 py-3 rounded-lg')}
            >
              <Text style={tailwind('text-white font-semibold text-center')}>Reset All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // --- Setup Screen ---
  if (!gameStarted) {
    const isMaxPlayersReached = players.length >= maxPlayers;

    return (
      <View style={tailwind('flex-1 bg-green-700 p-4 pt-12')}>
        <ScrollView contentContainerStyle={tailwind('pb-8')}>
          <View style={tailwind('bg-white rounded-2xl shadow-2xl p-6 mb-4')}>
            <View style={tailwind('flex flex-row justify-between items-center mb-6')}>
              <Text style={tailwind('text-3xl font-bold text-gray-800')}>Indian Rummy</Text>
              <TouchableOpacity
                onPress={() => setShowSettings(!showSettings)}
                style={tailwind('p-2 rounded-lg')}
              >
                <Text style={tailwind('text-2xl')}>{Settings().props.name}</Text>
              </TouchableOpacity>
            </View>

            {showSettings && (
              <View style={tailwind('mb-6 p-4 bg-gray-50 rounded-lg space-y-4')}>
                <View>
                  <Text style={tailwind('text-sm font-medium text-gray-700 mb-2')}>
                    Number of Rounds
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={String(totalRounds)}
                    onChangeText={(text) => {
                      const num = parseInt(text) || 1;
                      setTotalRounds(Math.max(1, num));
                    }}
                    style={tailwind('w-full px-4 py-2 border border-gray-300 rounded-lg bg-white')}
                  />
                  <Text style={tailwind('text-xs text-gray-500 mt-1')}>Lowest score after {totalRounds} rounds wins</Text>
                </View>
                <View>
                  <Text style={tailwind('text-sm font-medium text-gray-700 mb-2')}>
                    Maximum Players
                  </Text>
                  {/* Simplification: using TextInput instead of picker for cross-platform ease */}
                  <TextInput
                    keyboardType="numeric"
                    value={String(maxPlayers)}
                    onChangeText={(text) => {
                       const num = parseInt(text) || 6;
                       setMaxPlayers(Math.max(2, num)); // Min 2 players
                    }}
                    style={tailwind('w-full px-4 py-2 border border-gray-300 rounded-lg bg-white')}
                  />
                  <Text style={tailwind('text-xs text-gray-500 mt-1')}>Currently {maxPlayers} max players</Text>
                </View>
              </View>
            )}

            <View style={tailwind('mb-6')}>
              <View style={tailwind('flex flex-row gap-2 mb-4')}>
                <TextInput
                  value={newPlayerName}
                  onChangeText={setNewPlayerName}
                  placeholder="Enter player name"
                  editable={!isMaxPlayersReached}
                  style={tailwind(`flex-1 px-4 py-2 border border-gray-300 rounded-lg ${isMaxPlayersReached ? 'bg-gray-100' : 'bg-white'}`)}
                />
                <TouchableOpacity
                  onPress={addPlayer}
                  disabled={isMaxPlayersReached}
                  style={tailwind(`p-3 rounded-lg ${isMaxPlayersReached ? 'bg-gray-400' : 'bg-green-600'}`)}
                >
                  <Text style={tailwind('text-white font-bold')}>{Plus().props.name}</Text>
                </TouchableOpacity>
              </View>

              <View style={tailwind('space-y-2')}>
                {players.map(player => (
                  <View key={player.id} style={tailwind('flex flex-row justify-between items-center bg-gray-50 p-3 rounded-lg')}>
                    <Text style={tailwind('font-medium text-gray-800')}>{player.name}</Text>
                    <TouchableOpacity
                      onPress={() => removePlayer(player.id)}
                      style={tailwind('p-1 rounded')}
                    >
                      <Text style={tailwind('text-red-600')}>{Trash2().props.name}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                {isMaxPlayersReached && (
                  <Text style={tailwind('text-center text-sm text-amber-600 font-medium mt-2')}>
                    Maximum {maxPlayers} players reached
                  </Text>
                )}
              </View>
            </View>

            <TouchableOpacity
              onPress={startGame}
              disabled={players.length < 2}
              style={tailwind(`w-full py-3 rounded-lg ${players.length < 2 ? 'bg-gray-400' : 'bg-green-600'}`)}
            >
              <Text style={tailwind('text-white font-semibold text-center')}>
                Start Game ({players.length} players)
              </Text>
            </TouchableOpacity>
            {players.length < 2 && (
              <Text style={tailwind('text-center text-sm text-gray-600 mt-2')}>
                Add at least 2 players to start
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // --- Game In Progress Screen ---
  const sortedPlayers = [...players].sort((a, b) => a.total - b.total);

  return (
    <View style={tailwind('flex-1 bg-green-700 p-4 pt-12')}>
      <ScrollView contentContainerStyle={tailwind('pb-8')}>
        <View style={tailwind('bg-white rounded-2xl shadow-2xl p-6 mb-4')}>
          <View style={tailwind('flex flex-row justify-between items-center mb-6')}>
            <View>
              <Text style={tailwind('text-2xl font-bold text-gray-800')}>Round {currentRound} of {totalRounds}</Text>
              <Text style={tailwind('text-sm text-gray-600')}>Lowest score wins</Text>
            </View>
            <TouchableOpacity
              onPress={resetGame}
              style={tailwind('p-2 rounded-lg')}
            >
              <Text style={tailwind('text-2xl')}>{RotateCcw().props.name}</Text>
            </TouchableOpacity>
          </View>

          <View style={tailwind('space-y-4 mb-6')}>
            {players.map(player => (
              <View key={player.id} style={tailwind('bg-gray-50 p-4 rounded-lg')}>
                <View style={tailwind('flex flex-row justify-between items-center mb-2')}>
                  <Text style={tailwind('font-semibold text-gray-800')}>{player.name}</Text>
                  <Text style={tailwind('text-lg font-bold text-green-700')}>Total: {player.total}</Text>
                </View>
                <View style={tailwind('flex flex-row items-center gap-2')}>
                  <Text style={tailwind('text-sm text-gray-600 w-24')}>Round score:</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={roundScores[`${currentRound}-${player.id}`] || ''}
                    onChangeText={(text) => updateRoundScore(player.id, text)}
                    placeholder="0"
                    style={tailwind('flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white')}
                  />
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={completeRound}
            style={tailwind('w-full bg-green-600 py-3 rounded-lg')}
          >
            <Text style={tailwind('text-white font-semibold text-center')}>
              {currentRound === totalRounds ? 'Finish Game' : 'Complete Round'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={tailwind('bg-white rounded-2xl shadow-2xl p-6')}>
          <Text style={tailwind('text-xl font-bold text-gray-800 mb-4')}>Leaderboard</Text>
          <View style={tailwind('space-y-2')}>
            {sortedPlayers.map((player, idx) => (
              <View key={player.id} style={tailwind('flex flex-row justify-between items-center p-3 bg-gray-50 rounded-lg')}>
                <View style={tailwind('flex flex-row items-center gap-3')}>
                  <Text style={tailwind('font-bold text-gray-500')}>#{idx + 1}</Text>
                  <Text style={tailwind('font-medium text-gray-800')}>{player.name}</Text>
                </View>
                <Text style={tailwind('font-bold text-green-700')}>{player.total}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// In a real Expo app, we wrap the App component with the TailwindProvider
// For this single-file output, we simulate the required setup below.

// This is a minimal definition required by the tool. In a real Expo project,
// you would have a `tailwind.config.js` and wrap your App with a Provider.
// Since we can't create multiple files, this is the best we can do in one.
const defaultStyles = StyleSheet.create({});
const TailwindProvider = ({ children }) => {
  return children;
};
const useTailwindHook = () => ({});

// We replace the temporary dummy hooks with the real ones if the environment allowed,
// but for the sake of a single runnable file, we use the `useTailwind` import from the top.

// NOTE: For true compilation, you would need to initialize 'tailwind-rn' configuration
// and wrap the root component, but for the sake of the single-file mandate,
// this version contains all logic and mobile UI components.
