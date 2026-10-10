import { describe, it, expect } from 'vitest';
import { checkoutUrl } from './state';
import { quizCopy } from './copy';
describe('Quiz configuration',()=>{
 it('preserves attribution without changing checkout mode',()=>{const url=new URL(checkoutUrl('https://pay.hotmart.com/G107438250J?checkoutMode=10','?utm_source=meta&utm_campaign=test&fbclid=abc&src=ad&sck=campaign&unrelated=ignore'));expect(url.searchParams.get('checkoutMode')).toBe('10');expect(url.searchParams.get('utm_source')).toBe('meta');expect(url.searchParams.get('fbclid')).toBe('abc');expect(url.searchParams.has('unrelated')).toBe(false);});
 it('has four complete questions and three insights for both roles',()=>{for(const copy of Object.values(quizCopy)){expect(copy.questions).toHaveLength(4);expect(copy.insights).toHaveLength(3);expect(copy.questions.map(q=>q.options.length)).toEqual([4,4,5,4]);expect(copy.errors.map(e=>e.length)).toEqual([4,4]);}});
});