package net.plexprison.plexpurchases.utils;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.Optional;

/**
 * Utility class for parsing YAML files into data classes
 * Uses Jackson library for reliable YAML parsing
 */
public class YamlParser {

    private static final ObjectMapper yamlMapper;

    static {
        yamlMapper = new ObjectMapper(new YAMLFactory());
        // Configure mapper to be more lenient with unknown properties
        YamlParser.yamlMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        YamlParser.yamlMapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
    }

    /**
     * Parse a YAML file into the specified data class
     *
     * @param file        The YAML file to parse
     * @param targetClass The class to parse the YAML into
     * @param <T>         The type of the target class
     * @return Optional containing the parsed object, or empty if parsing failed
     */
    public static <T> Optional<T> parseFile(final File file, final Class<T> targetClass) {
        try {
            if (!file.exists()) {
                Logger.warning("YAML file does not exist: " + file.getPath());
                return Optional.empty();
            }

            final T result = YamlParser.yamlMapper.readValue(file, targetClass);
            Logger.debug("Successfully parsed YAML file: " + file.getPath());
            return Optional.of(result);

        } catch (final IOException e) {
            Logger.error("Failed to parse YAML file " + file.getPath() + ": " + e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Parse a YAML file from a path into the specified data class
     *
     * @param path        The path to the YAML file
     * @param targetClass The class to parse the YAML into
     * @param <T>         The type of the target class
     * @return Optional containing the parsed object, or empty if parsing failed
     */
    public static <T> Optional<T> parseFile(final Path path, final Class<T> targetClass) {
        return YamlParser.parseFile(path.toFile(), targetClass);
    }

    /**
     * Parse a YAML string into the specified data class
     *
     * @param yamlContent The YAML content as a string
     * @param targetClass The class to parse the YAML into
     * @param <T>         The type of the target class
     * @return Optional containing the parsed object, or empty if parsing failed
     */
    public static <T> Optional<T> parseString(final String yamlContent, final Class<T> targetClass) {
        try {
            final T result = YamlParser.yamlMapper.readValue(yamlContent, targetClass);
            Logger.debug("Successfully parsed YAML string");
            return Optional.of(result);

        } catch (final IOException e) {
            Logger.error("Failed to parse YAML string: " + e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Parse a YAML input stream into the specified data class
     *
     * @param inputStream The input stream containing YAML data
     * @param targetClass The class to parse the YAML into
     * @param <T>         The type of the target class
     * @return Optional containing the parsed object, or empty if parsing failed
     */
    public static <T> Optional<T> parseInputStream(final InputStream inputStream, final Class<T> targetClass) {
        try {
            final T result = YamlParser.yamlMapper.readValue(inputStream, targetClass);
            Logger.debug("Successfully parsed YAML from input stream");
            return Optional.of(result);

        } catch (final IOException e) {
            Logger.error("Failed to parse YAML from input stream: " + e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Write an object to a YAML file
     *
     * @param file   The file to write to
     * @param object The object to serialize
     * @param <T>    The type of the object
     * @return true if successful, false otherwise
     */
    public static <T> boolean writeToFile(final File file, final T object) {
        try {
            // Ensure parent directory exists
            final File parentDir = file.getParentFile();
            if (parentDir != null && !parentDir.exists()) {
                parentDir.mkdirs();
            }

            YamlParser.yamlMapper.writeValue(file, object);
            Logger.debug("Successfully wrote object to YAML file: " + file.getPath());
            return true;

        } catch (final IOException e) {
            Logger.error("Failed to write object to YAML file " + file.getPath() + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Write an object to a YAML file at the specified path
     *
     * @param path   The path to write the YAML file to
     * @param object The object to serialize
     * @param <T>    The type of the object
     * @return true if successful, false otherwise
     */
    public static <T> boolean writeToFile(final Path path, final T object) {
        return YamlParser.writeToFile(path.toFile(), object);
    }

    /**
     * Convert an object to a YAML string
     *
     * @param object The object to serialize
     * @param <T>    The type of the object
     * @return Optional containing the YAML string, or empty if serialization failed
     */
    public static <T> Optional<String> toString(final T object) {
        try {
            final String yaml = YamlParser.yamlMapper.writeValueAsString(object);
            Logger.debug("Successfully converted object to YAML string");
            return Optional.of(yaml);

        } catch (final IOException e) {
            Logger.error("Failed to convert object to YAML string: " + e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Merge two YAML objects, with the second object taking precedence
     *
     * @param base     The base object
     * @param override The object to merge on top of the base
     * @param <T>      The type of the objects
     * @return Optional containing the merged object, or empty if merging failed
     */
    public static <T> Optional<T> merge(final T base, final T override, final Class<T> targetClass) {
        try {
            final JsonNode baseNode = YamlParser.yamlMapper.valueToTree(base);
            final JsonNode overrideNode = YamlParser.yamlMapper.valueToTree(override);

            // Merge the nodes
            final ObjectNode mergedNode = (ObjectNode) baseNode.deepCopy();
            mergedNode.setAll((ObjectNode) overrideNode);

            final T result = YamlParser.yamlMapper.treeToValue(mergedNode, targetClass);
            Logger.debug("Successfully merged YAML objects");
            return Optional.of(result);

        } catch (final Exception e) {
            Logger.error("Failed to merge YAML objects: " + e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Validate that a YAML file can be parsed into the specified class
     *
     * @param file        The YAML file to validate
     * @param targetClass The class to validate against
     * @param <T>         The type of the target class
     * @return true if the file can be parsed, false otherwise
     */
    public static <T> boolean isValid(final File file, final Class<T> targetClass) {
        return YamlParser.parseFile(file, targetClass).isPresent();
    }

    /**
     * Validate that a YAML string can be parsed into the specified class
     *
     * @param yamlContent The YAML content to validate
     * @param targetClass The class to validate against
     * @param <T>         The type of the target class
     * @return true if the string can be parsed, false otherwise
     */
    public static <T> boolean isValid(final String yamlContent, final Class<T> targetClass) {
        return YamlParser.parseString(yamlContent, targetClass).isPresent();
    }
} 