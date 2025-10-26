# WWW Docker イメージ発行ルール

`www` 向け GitHub Actions ワークフロー（`.github/workflows/deploy.yaml`）で、イベントごとにどのタグが発行されるかを一覧にしました。対象イメージは `ghcr.io/<owner>/pf-www` です。

| シナリオ                                   | 対象ジョブ             | push 実行 | 発行されるタグ                                                                                    | 備考                                                                     |
| ------------------------------------------ | ---------------------- | --------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Pull Request → `main`                      | `build-www-staging`    | いいえ    | —                                                                                                 | ステージング Dockerfile をビルドして検証のみ。タグは発行しない。         |
| `main` ブランチへの push                   | `build-www-staging`    | はい      | `staging`, `sha-<commit>`                                                                         | ステージングイメージを GHCR へ発行。 `sha` はコミットハッシュ由来。      |
| `workflow_dispatch`（`target=staging`）    | `build-www-staging`    | はい      | `staging`, `sha-<commit>`                                                                         | 手動トリガーでも main ブランチ時と同じタグを発行。                       |
| タグ `v*` を push                          | `build-www-production` | はい      | `latest`, 各種 `semver` (`<major>.<minor>.<patch>`, `<major>.<minor>`, `<major>`), `sha-<commit>` | リリースビルド。`type=semver` はセマンティックバージョンタグでのみ生成。 |
| `workflow_dispatch`（`target=production`） | `build-www-production` | はい      | `latest`, `sha-<commit>`                                                                          | 手動でプロダクションビルドを再発行したい場合に利用。                     |

> **補足**
>
> - `sha-<commit>` は `docker/metadata-action@v5` の `type=sha` で自動生成されるタグです。
> - `type=semver` タグは `refs/tags/v*` のようなセマンティックバージョンタグでのみ出力され、その他イベントでは生成されません。
