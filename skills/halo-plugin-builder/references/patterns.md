# Common Patterns - Reusable Code Snippets

> This reference provides production-ready code patterns for common Halo plugin scenarios. Copy and adapt as needed.

## Backend Patterns

### Pattern 1: List with Pagination & Filtering

**Use Case**: Display a paginated list with search and filter options.

```java
public Flux<Todo> listTodos(String keyword, String status, int page, int size) {
    ListOptions options = ListOptions.builder()
        .fieldSelector()
        .fieldEquals("spec.status", status)
        .end()
        .build();

    if (keyword != null && !keyword.isBlank()) {
        // Add label filter for keyword search
        options.getLabelSelector()
            .eq("keyword", keyword.toLowerCase());
    }

    return client.list(Todo.class, options)
        .skip((long) page * size)
        .take(size);
}
```

---

### Pattern 2: External API Integration (Non-Blocking)

**Use Case**: Call external REST API from Reconciler without blocking.

```java
public Mono<ExternalData> fetchExternalData(String todoId) {
    return Mono.fromCallable(() -> {
        // Blocking HTTP call
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(
            "https://api.example.com/data/" + todoId,
            ExternalData.class
        );
    })
    .subscribeOn(Schedulers.boundedElastic())  // Run on separate thread pool
    .timeout(Duration.ofSeconds(10))
    .onErrorResume(e -> {
        log.error("External API failed", e);
        return Mono.empty();  // Return empty on failure
    });
}
```

---

### Pattern 3: Finalizer for Cleanup

**Use Case**: Delete associated resources when Extension is deleted.

```java
public Mono<Result> reconcile(Request request) {
    return client.fetch(Todo.class, request.name())
        .flatMap(todo -> {
            // Check if deletion is requested
            if (todo.getMetadata().getDeletionTimestamp() != null) {
                // Has finalizer?
                if (todo.getMetadata().getFinalizers().contains("todo-finalizer")) {
                    // Perform cleanup
                    return cleanupExternalResources(todo)
                        .then(Mono.defer(() -> {
                            // Remove finalizer to allow deletion
                            todo.getMetadata().getFinalizers().remove("todo-finalizer");
                            return client.update(todo);
                        }))
                        .thenReturn(Result.doNotRetry());
                }
                return Mono.just(Result.doNotRetry());
            }
            // Normal reconcile logic
            return handleNormalLogic(todo);
        });
}

private Mono<Void> cleanupExternalResources(Todo todo) {
    // Delete files, external DB records, etc.
    return Mono.fromRunnable(() -> {
        fileStorage.delete(todo.getSpec().getFilePath());
    }).then();
}

// Add finalizer when creating
public Mono<Todo> createTodo(String name, String content) {
    Todo todo = new Todo();
    todo.setMetadata(new Metadata());
    todo.getMetadata().setName(name);
    todo.getMetadata().getFinalizers().add("todo-finalizer");  // Add finalizer
    // ... set spec
    return client.create(todo);
}
```

---

### Pattern 4: Watching Related Resources

**Use Case**: Reconciler needs to react to changes in other Extensions.

```java
@Override
public Controller setupWith(ControllerBuilder builder) {
    return builder
        .extension(Todo.class)  // Watch Todo changes
        .build()
        .withReconciler(otherBuilder -> {
            // Also watch User changes
            otherBuilder.extension(User.class).build();
        });
}

// In reconcile(), detect what changed
@Override
public Mono<Result> reconcile(Request request) {
    String kind = request.kind();  // Which resource type triggered?
    
    if ("Todo".equals(kind)) {
        return reconcileTodo(request.name());
    } else if ("User".equals(kind)) {
        return reconcileUser(request.name());
    }
    return Mono.just(Result.doNotRetry());
}
```

---

### Pattern 5: Status Aggregation

**Use Case**: Aggregate status from multiple resources.

```java
public Mono<Result> reconcile(Request request) {
    return client.fetch(Project.class, request.name())
        .flatMap(project -> {
            // Get all related tasks
            return client.listAll(Task.class, ListOptions.builder()
                .labelSelector().eq("project", request.name()).end()
                .build())
                .collectList()
                .flatMap(tasks -> {
                    // Calculate aggregated status
                    long completed = tasks.stream()
                        .filter(t -> "completed".equals(t.getStatus().getPhase()))
                        .count();
                    
                    Project.Status status = new Project.Status();
                    status.setTotalTasks(tasks.size());
                    status.setCompletedTasks((int) completed);
                    status.setProgress(tasks.isEmpty() ? 0 : (completed * 100 / tasks.size()));
                    
                    // Only update if changed
                    if (!Objects.equals(project.getStatus(), status)) {
                        project.setStatus(status);
                        return client.update(project);
                    }
                    return Mono.just(project);
                });
        })
        .thenReturn(Result.doNotRetry());
}
```

---

## Frontend Patterns

### Pattern 6: Table with Actions

**Use Case**: Display a data table with edit/delete actions.

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiClient } from "@halo-dev/console-shared";
import { useToast } from "@halo-dev/console-shared";

const toast = useToast();
const items = ref([]);
const loading = ref(false);

const columns = [
  { title: "Name", dataIndex: "metadata.name", key: "name" },
  { title: "Status", dataIndex: "status.phase", key: "status" },
  { title: "Created", dataIndex: "metadata.creationTimestamp", key: "created" },
  { title: "Actions", key: "actions" }
];

const fetchData = async () => {
  loading.value = true;
  try {
    const { data } = await apiClient.extension.customResource.list(
      "plugin.halo.run",
      "v1alpha1",
      "todos"
    );
    items.value = data.items || [];
  } catch (e) {
    toast.error("Failed to load data");
  } finally {
    loading.value = false;
  }
};

const handleDelete = (record) => {
  apiClient.extension.customResource.delete(
    "plugin.halo.run",
    "v1alpha1",
    "todos",
    record.metadata.name
  ).then(() => {
    toast.success("Deleted successfully");
    fetchData();
  });
};

onMounted(fetchData);
</script>

<template>
  <v-card title="Todo List" :loading="loading">
    <v-table
      :columns="columns"
      :data-source="items"
      row-key="metadata.name"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <v-button size="small" type="link" @click="handleEdit(record)">
            Edit
          </v-button>
          <v-button size="small" type="link" danger @click="handleDelete(record)">
            Delete
          </v-button>
        </template>
      </template>
    </v-table>
  </v-card>
</template>
```

---

### Pattern 7: Form with Validation

**Use Case**: Create/edit form with client-side validation.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { apiClient } from "@halo-dev/console-shared";
import { useToast } from "@halo-dev/console-shared";

const toast = useToast();
const form = ref({
  metadata: { name: "" },
  spec: {
    title: "",
    description: "",
    priority: "normal"
  }
});

const rules = {
  "metadata.name": [{ required: true, message: "Name is required" }],
  "spec.title": [{ required: true, message: "Title is required" }]
};

const handleSubmit = async () => {
  try {
    await apiClient.extension.customResource.create(
      "plugin.halo.run",
      "v1alpha1",
      "todos",
      form.value
    );
    toast.success("Created successfully");
    // Reset or navigate
  } catch (e) {
    toast.error("Failed to create");
  }
};
</script>

<template>
  <v-card title="Create Todo">
    <v-form :model="form" :rules="rules" @finish="handleSubmit">
      <v-form-item label="Name" name="metadata.name">
        <v-input v-model:value="form.metadata.name" placeholder="Unique name" />
      </v-form-item>
      
      <v-form-item label="Title" name="spec.title">
        <v-input v-model:value="form.spec.title" placeholder="Todo title" />
      </v-form-item>
      
      <v-form-item label="Description" name="spec.description">
        <v-textarea 
          v-model:value="form.spec.description" 
          :rows="4"
          placeholder="Description"
        />
      </v-form-item>
      
      <v-form-item label="Priority" name="spec.priority">
        <v-select v-model:value="form.spec.priority">
          <v-select-option value="low">Low</v-select-option>
          <v-select-option value="normal">Normal</v-select-option>
          <v-select-option value="high">High</v-select-option>
        </v-select>
      </v-form-item>
      
      <v-form-item>
        <v-button type="primary" html-type="submit">Create</v-button>
      </v-form-item>
    </v-form>
  </v-card>
</template>
```

---

### Pattern 8: Real-time Updates (WebSocket)

**Use Case**: Automatically refresh data when Extension changes.

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { apiClient } from "@halo-dev/console-shared";

const items = ref([]);
let watchHandle = null;

const fetchData = async () => {
  const { data } = await apiClient.extension.customResource.list(
    "plugin.halo.run",
    "v1alpha1",
    "todos"
  );
  items.value = data.items || [];
};

const watchResources = () => {
  // Watch for Todo changes
  watchHandle = apiClient.extension.customResource.watch(
    "plugin.halo.run",
    "v1alpha1",
    "todos"
  );
  
  watchHandle.subscribe({
    next: (event) => {
      // Refresh data on any change
      fetchData();
    },
    error: (err) => {
      console.error("Watch error:", err);
    }
  });
};

onMounted(() => {
  fetchData();
  watchResources();
});

onUnmounted(() => {
  if (watchHandle) {
    watchHandle.unsubscribe();
  }
});
</script>
```

---

### Pattern 9: Attachment Upload

**Use Case**: Allow users to upload and select files.

```vue
<script setup lang="ts">
import { ref } from "vue";
import AttachmentSelectorModal from "@halo-dev/console-shared/modules/attachment/components/AttachmentSelectorModal.vue";

const attachmentSelectorVisible = ref(false);
const selectedAttachment = ref(null);

const handleAttachmentSelect = (attachment) => {
  selectedAttachment.value = attachment;
  attachmentSelectorVisible.value = false;
};
</script>

<template>
  <v-card>
    <v-button @click="attachmentSelectorVisible = true">
      Select File
    </v-button>
    
    <div v-if="selectedAttachment" class="attachment-preview">
      <img :src="selectedAttachment.url" alt="Preview" />
      <p>{{ selectedAttachment.spec.displayName }}</p>
    </div>
    
    <AttachmentSelectorModal
      v-model:visible="attachmentSelectorVisible"
      @select="handleAttachmentSelect"
    />
  </v-card>
</template>

<style scoped>
.attachment-preview {
  margin-top: 16px;
}
.attachment-preview img {
  max-width: 200px;
  max-height: 200px;
}
</style>
```

---

## Configuration Patterns

### Pattern 10: Reactive Setting Fetcher

**Use Case**: Read plugin configuration with type safety.

```java
public record PluginConfig(
    @JsonProperty("apiEndpoint")
    String apiEndpoint,
    
    @JsonProperty("apiKey")
    String apiKey,
    
    @JsonProperty("timeout")
    Integer timeout
) {
    public static final String GROUP = "my-plugin-config";
}

@Component
public class ConfigService {
    
    private final ReactiveSettingFetcher fetcher;
    private Mono<PluginConfig> configCache;
    
    public Mono<PluginConfig> getConfig() {
        if (configCache == null) {
            configCache = fetcher.fetch(PluginConfig.class)
                .cache();  // Cache in memory
        }
        return configCache;
    }
    
    public Mono<String> getApiKey() {
        return getConfig()
            .map(PluginConfig::apiKey)
            .switchIfEmpty(Mono.error(new ConfigException("API key not configured")));
    }
}
```

---

## Extension Point Patterns

### Pattern 11: Custom Post Processor

**Use Case**: Modify post content before saving.

```java
@Component
public class MyPostProcessor implements PostContentHandler {
    
    @Override
    public Mono<PostContent> handle(PostContentContext context) {
        return Mono.just(context.getContent())
            .map(content -> {
                // Add custom metadata or transform content
                String raw = content.getRaw();
                String processed = transform(raw);
                content.setRaw(processed);
                return content;
            });
    }
}

// Register in src/main/resources/extensions
// extension-point-post-content-handler.yaml
```

---

## Migration & Testing Patterns

### Pattern 12: Data Migration Script

**Use Case**: Migrate data from old version to new schema.

```java
@Component
public class DataMigrationReconciler implements Reconciler<Request> {
    
    @Override
    public Mono<Result> reconcile(Request request) {
        return client.fetch(Plugin.class, "my-plugin")
            .flatMap(plugin -> {
                String currentVersion = plugin.getSpec().getVersion();
                
                // Migrate from v1.0 to v1.1
                if (versionCompare(currentVersion, "1.1.0") < 0) {
                    return migrateV1ToV1()
                        .then(Mono.defer(() -> {
                            plugin.getSpec().setVersion("1.1.0");
                            return client.update(plugin);
                        }));
                }
                return Mono.just(Result.doNotRetry());
            });
    }
    
    private Mono<Void> migrateV1ToV1() {
        // Perform data migration
        return client.listAll(OldExtension.class)
            .flatMap(old -> {
                NewExtension neu = convert(old);
                return client.create(neu);
            })
            .then();
    }
}
```

---

**Usage Tips**:
1. Always validate input before using patterns
2. Adapt error handling to your specific use case
3. Test patterns in development environment first
4. Check Halo version compatibility for extension points
