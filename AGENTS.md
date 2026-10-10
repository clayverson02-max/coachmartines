<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep quiz content at `/` with a Context-backed session state machine; this preserves the complete funnel across refresh without requiring registration.
- Centralize offer links, prices, video URL and public pixel ID in `src/config/quiz.ts`; this keeps every checkout CTA consistent.
- Send Meta browser and server events with the same event ID; signed expiring first-party sessions and strict validation protect the public server function, while credentials remain exclusively in encrypted Cloud secrets.
- Use approved media through Lovable Assets pointer imports; this preserves supplied imagery without committing binaries.
