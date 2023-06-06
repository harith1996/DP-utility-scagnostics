import React from 'react'
import scagnostics from '../lib/scagnostics'

const scores = ['clumpyScore', 'convexScore', 'outlyingScore', 'outlyingUpperBoundScore', 'skewedScore', 'sparseScore', 'striatedScore', 'monotonicScore', 'histogramScore', 'multiModalScore', 'overlappingScore', 'clusteredScore', 'clumpyScore', 'convexScore', 'skinnyScore', 'stringyScore', 'stringyScore', 'monotonicScore', 'histogramScore', 'outlyingScore', 'outlyingUpperBoundScore', 'sparseScore', 'skewedScore']

export default function ScagnosticsDisplay(props: any) {
  return (
    <div>
        {scores.map((score) => {
            if(props.scagnostics.hasOwnProperty(score))
                return (
                    // make a table with the scagnostics scores
                    <div>
                        <table>
                            <tr>
                                <td>{score}</td>
                                <td>{props.scagnostics[score].toFixed(5)}</td>
                            </tr>
                        </table>
                    </div>
                )
            return ""
        })}
        </div>
  )
}
