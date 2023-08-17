import React from 'react'

function VocabularyList({ words }) {
    return (
        <table className='vocabulary-list'>
            <thead>
                <tr className='vocabulary-list-header'>
                    <th>Word</th>
                    <th>Translation</th>
                    <th>Level</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {words.map((word, index) => (
                    <tr key={index}>
                        <td>{word.word}</td>
                        <td>{word.translation}</td>
                        <td>{word.level}</td>
                        <td>{word.time}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default VocabularyList