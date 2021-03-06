import React from 'react';
import { messages } from '../constants';
import { useAppContext } from './Context';

const colors = ['bg-blue-600', 'bg-yellow-600', 'bg-orange-600', 'bg-red-600'];

function Code({ children }) {
  return <span className="font-bold font-mono">{children}</span>;
}

function ResultSuggestion({ data, advise }) {
  const { parsed, jsEditorRef } = useAppContext();

  const used = parsed?.expression || {};

  const usingAdvisedMethod = advise.method === used.method;
  const hasNameArg = data.name && used.args?.[1]?.includes('name');

  const color = usingAdvisedMethod ? 'bg-green-600' : colors[advise.level];

  const target = parsed.target || {};

  let suggestion;

  if (advise.level < used.level) {
    suggestion = (
      <p>
        You&apos;re using <Code>{used.method}</Code>, which falls under{' '}
        <Code>{messages[used.level].heading}</Code>. Upgrading to{' '}
        <Code>{advise.method}</Code> is recommended.
      </p>
    );
  } else if (advise.level === 0 && advise.method !== used.method) {
    suggestion = (
      <p>
        Nice! <Code>{used.method}</Code> is a great selector! Using{' '}
        <Code>{advise.method}</Code> would still be preferable though.
      </p>
    );
  } else if (target.tagName === 'INPUT' && !target.getAttribute('type')) {
    suggestion = (
      <p>
        You can unlock <Code>getByRole</Code> by adding the{' '}
        <Code>type=&quot;text&quot;</Code> attribute explicitly. Accessibility
        will benefit from it.
      </p>
    );
  } else if (
    advise.level === 0 &&
    advise.method === 'getByRole' &&
    !data.name
  ) {
    suggestion = (
      <p>
        Awesome! This is great already! You could still make the query a bit
        more specific by adding the name option. This would require to add some
        markup though, as your element isn&apos;t named properly.
      </p>
    );
  } else if (
    advise.level === 0 &&
    advise.method === 'getByRole' &&
    data.name &&
    !hasNameArg
  ) {
    suggestion = (
      <p>
        There is one thing though. You could make the query a bit more specific
        by adding the name option.
      </p>
    );
  } else if (used.level > 0) {
    suggestion = (
      <p>
        This isn&apos;t great, but we can&apos;t do better with the current
        markup. Extend your html to improve accessibility and unlock better
        queries.
      </p>
    );
  } else {
    suggestion = <p>This is great. Ship it!</p>;
  }

  const handleClick = () => {
    jsEditorRef.current.setValue(advise.expression);
  };

  return (
    <div className="space-y-4 text-sm">
      <div className={['text-white p-4 rounded space-y-2', color].join(' ')}>
        <div className="font-bold text-xs">suggested query</div>
        {advise.expression && (
          <div
            className="font-mono cursor-pointer text-xs"
            onClick={handleClick}
          >
            &gt; {advise.expression}
          </div>
        )}
      </div>
      <div className="min-h-8">{suggestion}</div>
    </div>
  );
}

export default ResultSuggestion;
