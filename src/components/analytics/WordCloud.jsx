import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WordCloud({ feedback, loading }) {
  const keywordData = useMemo(() => {
    const words = {};
    
    // Extract words from feedback content and titles
    feedback.forEach(f => {
      const text = `${f.title} ${f.content}`.toLowerCase();
      const wordList = text.match(/\b[a-z]{4,}\b/g) || []; // Words with 4+ letters
      
      // Filter out common words
      const stopWords = ['that', 'this', 'with', 'from', 'have', 'been', 'were', 'they', 'their', 'would', 'there', 'about', 'when', 'what'];
      
      wordList.forEach(word => {
        if (!stopWords.includes(word)) {
          words[word] = (words[word] || 0) + 1;
        }
      });
    });
    
    // Get top 50 words
    return Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50);
  }, [feedback]);

  const maxCount = keywordData.length > 0 ? keywordData[0][1] : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
          {keywordData.map(([word, count]) => {
            const size = 12 + (count / maxCount) * 32;
            const opacity = 0.4 + (count / maxCount) * 0.6;
            
            return (
              <span
                key={word}
                style={{
                  fontSize: `${size}px`,
                  opacity,
                  color: '#6366f1'
                }}
                className="font-semibold hover:text-indigo-700 cursor-pointer transition-colors"
                title={`${count} mentions`}
              >
                {word}
              </span>
            );
          })}
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {keywordData.slice(0, 12).map(([word, count]) => (
            <div key={word} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium text-gray-700">{word}</span>
              <span className="text-sm text-gray-500">{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}