## How to use

We use `pnpm` to manage dependencies. Learn how to install `pnpm` [here](https://pnpm.io/installation)

### Setup

Install dependencies for all apps:

```
pnpm install
```

[Optional] Install pods where applicable

```
pnpm pods
```

Pods might sometimes be outdated, and they might fail to install, in that case you can update them by running:

```
pnpm pods:update
```

### Run

Start dev server for host and mini apps:

```
pnpm start
```

```
pnpm start:<app-name>
```

Or start dev server for a specific app as a standalone app. It's useful for testing micro-frontend as a standalone app:

```
pnpm start:standalone:<app-name>
```

Running the mini app as a standalone requires running the [catalog-server](./packages/catalog-server/README.md) and [auth module](./packages/auth/README.md):

```
pnpm start:catalog
```

```
pnpm start:auth
```

Or run commands concurrently:

```
pnpm concurrently -P "pnpm start:catalog" "pnpm start:auth"
```

Run iOS or Android app (ios | android):

```
pnpm run:<app-name>:<platform>
```

For Android, make sure to reverse adb ports:

```
pnpm adbreverse
```

There is no `start:shell` script to avoid running shell and host app concurrently. It's not possible to run shell and host app concurrently, since they use the same port. If you want to run shell app, you should run `pnpm start:standalone:shell` and then run each mini app bundler you want to use in shell app.

### Test

Run tests for all apps:

```
pnpm test
```

### Lint

Run linter for all apps:

```
pnpm lint
```

### Type check

Run type check for all apps:

```
pnpm typecheck
```
