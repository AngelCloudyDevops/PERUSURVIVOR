FROM node:24-alpine
WORKDIR /runtime
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
USER node
CMD ["node", "/launcher.cjs"]
