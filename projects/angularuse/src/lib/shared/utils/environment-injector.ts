import { EnvironmentInjector, Injector, runInInjectionContext } from '@angular/core';
import { _useOnDestroy } from './_on-destroy';

export const useEnvironmentInjector = (): EnvironmentInjector => {
  const injector = Injector.create({ providers: [] }) as EnvironmentInjector;
  const destroy = _useOnDestroy();

  destroy(() => {
    injector.destroy();
  });

  return injector;
};

export const useRunInInjectContext = (): (<ReturnT>(fn: () => ReturnT) => ReturnT) => {
  const injector = useEnvironmentInjector();

  return <ReturnT>(fn: () => ReturnT): ReturnT => {
    return runInInjectionContext(injector, fn);
  };
};
