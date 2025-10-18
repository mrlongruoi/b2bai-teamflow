// import z from "zod";
// import { base } from "../middlewares/base";
// import { ChannelNameSchema } from "../schemas/channel";
// import { requiredAuthMiddleware } from "../middlewares/auth";
// import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
// import { standardSecurityMiddleware } from "../middlewares/arcjet/standard";
// import { heavyWriteSecurityMiddleware } from "../middlewares/arcjet/heavy-write";

// export const createChannel = base
//   .use(requiredAuthMiddleware)
//   .use(requiredWorkspaceMiddleware)
//   .use(standardSecurityMiddleware)
//   .use(heavyWriteSecurityMiddleware)
//   .route({
//     method: "POST",
//     path: "/channels",
//     summary: "Tạo kênh mới trong không gian làm việc",
//     tags: ["channels"],
//   })
//   .input(ChannelNameSchema)
//   .output(z.void())
//   .handler(async ({input, errors, context}) => {

//   })
